const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const pwd_generator = require('generate-password');

// Config and Constants
const api = require('../../config/api');
const urls = require('../../constants/urls');
const system_settings = require('../../config/system_settings');

// Models
const User = require('../../models/user');

const ses = new AWS.SES({
  accessKeyId: api.AWS.AWS_ACCESS_KEY,
  secretAccessKey: api.AWS.AWS_SECRET_ACCESS_KEY,
  region: api.AWS.AWS_SES_REGION,
  apiVersion: '2010-12-01',
});

const mailcomposer = require('mailcomposer');
const { waitForDebugger } = require('inspector');

const checkAuth = async (req, res, next) => {
  const bearerToken = req.get('Authorization');
  let token;
  if (bearerToken) {
    token = bearerToken.split(' ')[1];
  }

  let decoded;
  try {
    decoded = jwt.verify(token, api.JWT_SECRET);
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  } catch (err) {
    console.log('check verify error', err.message || err.msg);
    return res.status(401).send(err.message || 'check user error');
  }

  req.currentUser = await User.findOne({
    _id: decoded.id,
    role: 'admin',
  }).catch((err) => {
    console.log('user find err', err.message);
  });

  if (req.currentUser) {
    console.info('Auth Success:', req.currentUser.email);
    next();
  } else {
    console.error('Valid JWT but no user:', decoded);
    res.status(401).send('invalid_user');
  }
};

const get = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
  });

  if (!user) {
    return res.status(400).json({
      status: false,
      error: 'User doesn`t exist',
    });
  }

  return res.send({
    status: true,
    user,
  });
};

const create = async (req, res) => {
  const email = req.body.email;
  const userByEmail = await User.findOne({
    email,
  });
  if (userByEmail) {
    res.send({
      status: false,
      msg: 'Email address already exists',
    });
    return;
  }

  const user = new User({
    ...req.body,
    isActive: true,
    verifiedEmail: false,
  });

  user.save().catch((err) => {
    console.log('user save err', err.message);
  });

  const signupLink = urls.USER_SIGNUP_URL + '?email=' + user.email;
  // console.log('>>> sign up URL', signupLink);
  const html = `<b>Hi ${user.firstName} ${user.lastName},</b><br/>

  <b>Welcome to Loyalty!</b><br/><br/>

  You can sign up here.<br/><br/>

  <a href="${signupLink}">Click here to get started.</a><br/><br/>

  Take care!<br/>
  The Loyalty Team`;

  return Promise.resolve().then(() => {
    let sendRawEmailPromise;

    const mail = mailcomposer({
      from: system_settings.REPLY_EMAIL,
      to: user.email,
      subject: 'Loyalty sign up email',
      // text,
      html,
    });

    return new Promise((resolve, reject) => {
      mail.build((err, message) => {
        if (err) {
          // console.log('>>> mail.build > err', err);
          reject(`Error sending raw email: ${err}`);
        }
        // console.log('>>> mail.build success > message', message);
        sendRawEmailPromise = ses
          .sendRawEmail({ RawMessage: { Data: message } })
          .promise();
      });

      resolve(sendRawEmailPromise);
    })
      .then(() => {
        console.log('>>> sendEmail: sns publish success!');
        res.send({
          status: true,
        });
      })
      .catch((err) => {
        console.error('>>> sendEmail: error', err);
        res.send({
          status: false,
        });
      });
  });
};

const loadByQuery = async (req, res) => {
  const { isActive, page, limit } = req.body;
  let { searchText } = req.body;

  /**
   * 1. Alphabetical A-Z
   * 2. Default User
   * 3. Admin
   * 4. Active
   */
  const sort = Number.parseInt(req.body.sort);

  const query = [];
  if (searchText) {
    searchText = searchText.trim();
    let searchTextArr = searchText.split(' ');
    searchTextArr = searchTextArr.filter((item) => item);
    if (searchTextArr.length >= 2) {
      query.push({
        $match: {
          $or: [
            {
              $and: [
                {
                  firstName: { $regex: searchTextArr[0] + '.*', $options: 'i' },
                },
                {
                  lastName: { $regex: searchTextArr[1] + '.*', $options: 'i' },
                },
              ],
            },
            {
              email: { $regex: searchText + '.*', $options: 'i' },
            },
          ],
        },
      });
    } else if (searchText.length > 0) {
      query.push({
        $match: {
          $or: [
            {
              firstName: { $regex: searchText + '.*', $options: 'i' },
            },
            {
              lastName: { $regex: searchText + '.*', $options: 'i' },
            },
            {
              email: { $regex: searchText + '.*', $options: 'i' },
            },
          ],
        },
      });
    }
  }

  if (sort === 1) {
    // Alphabetical A-Z
    query.push({
      $sort: {
        firstName: 1,
        lastName: 1,
      },
    });
  } else if (sort === 2) {
    // Default User
    query.push({
      $match: {
        role: {
          $ne: 'admin',
        },
      },
    });

    query.push({
      $sort: {
        firstName: 1,
        lastName: 1,
      },
    });
  } else if (sort === 3) {
    // Admin
    query.push({
      $match: {
        role: 'admin',
      },
    });

    query.push({
      $sort: {
        firstName: 1,
        lastName: 1,
      },
    });
  } else if (sort === 4) {
    // Active
    query.push({
      $match: {
        isActive,
      },
    });

    query.push({
      $sort: {
        firstName: 1,
        lastName: 1,
      },
    });
  }
  // add id field
  query.push({
    $addFields: {
      id: '$_id',
    },
  });

  // get the total count
  query.push({
    $count: 'totalCount',
  });
  const response = await User.aggregate(query).exec();

  let totalCount = 0;
  if (response.length > 0) {
    totalCount = response[0].totalCount;
  }
  query.pop();

  const skip = page * limit;
  if (skip > 0) {
    query.push({
      $skip: skip,
    });
  }

  query.push({
    $limit: limit,
  });

  const users = await User.aggregate(query).exec();
  return res.send({
    status: true,
    users,
    totalCount,
  });
};

const update = async (req, res) => {
  delete req.body.salt;
  delete req.body.hash;

  User.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        ...req.body,
      },
    }
  )
    .then(() => {
      res.send({
        status: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'User Update Error',
      });
    });
};

const remove = (req, res) => {
  User.deleteOne({
    _id: req.params.id,
  })
    .then(() => {
      return res.send({
        status: true,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        error: err.message || 'User Delete Error',
      });
    });
};

const setActive = async (req, res) => {
  const { isActive } = req.body;
  console.log('>>> setActive, isActive', isActive);
  User.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        isActive,
      },
    }
  )
    .then(() => {
      res.send({
        status: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'User Update Error',
      });
    });
};

const setAdmin = async (req, res) => {
  const { isAdmin } = req.body;
  console.log('>>> setAdmin, isAdmin', isAdmin);
  let role = '';
  if (isAdmin) {
    role = 'admin';
  }
  User.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        role,
      },
    }
  )
    .then(() => {
      res.send({
        status: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'User Update Error',
      });
    });
};

const resetPassword = async (req, res) => {
  // const { new_password } = req.body;
  const new_password = pwd_generator.generate({
    length: 10,
    numbers: true,
  });

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(new_password, salt, 10000, 512, 'sha512')
    .toString('hex');
  const user = await User.findOne({
    _id: req.params.id,
  });

  if (!user) {
    return res.status(400).json({
      status: false,
      error: 'User doesn`t exist',
    });
  }

  User.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        salt,
        hash,
      },
    }
  )
    .then(() => {
      const html = `<b>Hi ${user.firstName} ${user.lastName},</b><br/><br/>

      <b>Loyalty reset your password</b><br/><br/>
    
      Your new password: ${new_password}<br/><br/>
    
      From now, you can use this new password.<br/><br/>

      Take care!<br/>
      The Loyalty Team`;

      console.log('>>> reset password, new password is ', new_password);
      return Promise.resolve().then(() => {
        let sendRawEmailPromise;

        const mail = mailcomposer({
          from: system_settings.REPLY_EMAIL,
          to: user.email,
          subject: 'Loyalty reset your password',
          html,
        });

        return new Promise((resolve, reject) => {
          mail.build((err, message) => {
            if (err) {
              // console.log('>>> mail.build > err', err);
              reject(`Error sending raw email: ${err}`);
            }
            // console.log('>>> mail.build success > message', message);
            sendRawEmailPromise = ses
              .sendRawEmail({ RawMessage: { Data: message } })
              .promise();
          });

          resolve(sendRawEmailPromise);
        })
          .then(() => {
            console.log('>>> sendEmail: sns publish success!');
            res.send({
              status: true,
            });
          })
          .catch((err) => {
            console.error('>>> sendEmail: error', err);
            res.send({
              status: false,
            });
          });
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'User Update Error',
      });
    });
};

const getVerifiedEmail = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({
    email,
  });

  console.log('>>> user', user, email);
  if (!user) {
    return res.send({
      status: false,
    });
  }

  let verifiedEmail = false;
  if (user.verifiedEmail !== undefined) {
    verifiedEmail = user.verifiedEmail;
  }
  return res.send({
    status: true,
    verifiedEmail,
  });
};

const setReportsAccess = async (req, res) => {
  const { isReportsAccess } = req.body;
  console.log('>>> setReportsAccess, isReportsAccess', isReportsAccess);

  User.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        isReportsAccess,
      },
    }
  )
    .then(() => {
      res.send({
        status: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'User Update Error',
      });
    });
};

module.exports = {
  checkAuth,
  get,
  create,
  loadByQuery,
  update,
  remove,
  setActive,
  setAdmin,
  resetPassword,
  getVerifiedEmail,
  setReportsAccess,
};

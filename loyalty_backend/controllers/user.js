const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const { validationResult } = require('express-validator');

const api = require('../config/api');
const User = require('../models/user');

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({
      status: false,
      error: errors.array(),
    });
  }

  const { email, password } = req.body;

  const _user = await User.findOne({
    email: new RegExp(email, 'i'),
    del: false,
    isActive: true,
  });

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'no_user',
    });
  }

  if (_user.salt) {
    // Check password
    const hash = crypto
      .pbkdf2Sync(password, _user.salt.split(' ')[0], 10000, 512, 'sha512')
      .toString('hex');

    if (hash !== _user.hash) {
      return res.status(401).json({
        status: false,
        error: 'invalid_password!',
      });
    }
  }

  const token = jwt.sign({ id: _user.id }, api.JWT_SECRET, {
    expiresIn: '30d', // expires in 365 days
  });
  const myJSON = JSON.stringify(_user);
  const user = JSON.parse(myJSON);

  delete user.hash;
  delete user.salt;

  return res.send({
    status: true,
    accessToken: token,
    user,
  });
};

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

  req.currentUser = await User.findOne({ _id: decoded.id }).catch((err) => {
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

const getMe = async (req, res) => {
  const { currentUser } = req;

  const myJSON = JSON.stringify(currentUser);
  const user = JSON.parse(myJSON);
  delete user.hash;
  delete user.salt;

  return res.json({
    status: true,
    user,
  });
};

const editMe = async (req, res) => {
  const { currentUser } = req;

  const editData = { ...req.body };

  // TODO: should limit the editing fields here
  delete editData.password;
  delete editData.avatar;

  if (editData.clearAvatar) {
    editData.avatar = '';
    delete editData.clearAvatar;
  } else if (req.file) {
    editData.avatar = req.file.location;
  }

  await User.updateOne(
    {
      _id: currentUser.id,
    },
    {
      $set: {
        ...editData,
      },
    }
  );

  const _user = await User.findOne({
    _id: currentUser.id,
    del: false,
  });

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'no_user',
    });
  }
  return res.send({
    user: _user,
  });
};

const resetPasswordByOld = async (req, res) => {
  // const { old_password, new_password } = req.body;
  const { new_password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error_array = errors.array();
    return res.json({
      status: false,
      error: error_array[0].msg,
    });
  }

  const _user = req.currentUser;

  // if (!_user.salt) {
  //   return res.json({
  //     status: false,
  //     error: 'User has no password',
  //   });
  // }

  // Check old password
  // const old_hash = crypto
  //   .pbkdf2Sync(old_password, _user.salt.split(' ')[0], 10000, 512, 'sha512')
  //   .toString('hex');

  // if (old_hash !== _user.hash) {
  //   return res.json({
  //     status: false,
  //     error: 'Invalid old password!',
  //   });
  // }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(new_password, salt, 10000, 512, 'sha512')
    .toString('hex');

  _user.salt = salt;
  _user.hash = hash;
  _user.save();

  return res.json({
    status: true,
  });
};

const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array(),
    });
  }

  const _user = await User.findOne({
    email: new RegExp(req.body.email, 'i'),
    del: false,
  }).catch((err) => {
    console.log('user find err in signup', err.message);
  });

  if (!_user) {
    return res.status(400).send({
      status: false,
      error: 'user_does_not_exist',
    });
  }

  const password = req.body.password;
  console.log('>>> password', password);
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');

  // const user = new User({
  //   ...req.body,
  //   salt,
  //   hash,
  //   verifiedEmail: true,
  // });
  _user.salt = salt;
  _user.hash = hash;
  _user.verifiedEmail = true;
  _user.firstName = req.body.firstName;
  _user.lastName = req.body.lastName;
  _user
    .save()
    .then((_res) => {
      const token = jwt.sign(
        {
          id: _res.id,
        },
        api.JWT_SECRET,

        {
          expiresIn: '30d', // expires in 365 days
        }
      );

      const myJSON = JSON.stringify(_res);
      const user = JSON.parse(myJSON);
      delete user.hash;
      delete user.salt;

      return res.send({
        status: true,
        data: {
          token,
          user,
        },
      });
    })
    .catch((err) => {
      return res.status(500).send({
        status: false,
        error: err.message,
      });
    });
};

const resetPasswordByCode = async (req, res) => {
  const { code, email, password } = req.body;

  const user = await User.findOne({
    email: new RegExp(email, 'i'),
    del: false,
  });

  if (!user) {
    return res.json({
      status: false,
      error: 'no_user',
    });
  }

  if (!user.salt) {
    return res.json({
      status: false,
      error: 'no_password',
    });
  }

  const aryPassword = user.salt.split(' ');
  if (!aryPassword[1] || aryPassword[1] !== code) {
    // Code mismatch
    return res.json({
      status: false,
      error: 'invalid_code',
    });
  }
  // Expire check
  const delay = new Date().getTime() - user['updated_at'].getTime();

  if (delay > 1000 * 60 * 15) {
    // More than 15 minutes passed
    return res.json({
      status: false,
      error: 'expired_code',
    });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');

  user['salt'] = salt;
  user['hash'] = hash;

  user.save().catch((err) => {
    console.log('user password reset by code err', err.message);
  });

  return res.send({
    status: true,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      status: false,
      error: 'no_email',
    });
  }

  const _user = await User.findOne({
    email: new RegExp(email, 'i'),
    del: false,
  });

  if (!_user) {
    return res.json({
      status: false,
      error: 'no_user',
    });
  }
  if (_user['salt']) {
    const code = randomstring.generate({
      length: 5,
      charset: '1234567890ABCDEFHJKMNPQSTUVWXYZ',
    });

    const oldSalt = _user['salt'].split(' ')[0];
    _user['salt'] = oldSalt + ' ' + code;
    _user['updated_at'] = new Date();
    _user.save();
  } else {
    return res.json({
      status: false,
      error: 'No password',
    });
  }
};

module.exports = {
  login,
  signUp,
  checkAuth,
  getMe,
  editMe,
  forgotPassword,
  resetPasswordByOld,
  resetPasswordByCode,
};

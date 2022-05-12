const mongoose = require('mongoose');

const { DB_PORT } = require('../config/database');
const { ENV_PATH } = require('../config/path');

require('dotenv').config({ path: ENV_PATH });

const api = require('../config/api');
const AWS = require('aws-sdk');

const ses = new AWS.SES({
  accessKeyId: api.AWS.AWS_ACCESS_KEY1,
  secretAccessKey: api.AWS.AWS_SECRET_ACCESS_KEY1,
  region: api.AWS.AWS_SES_REGION,
  apiVersion: '2010-12-01',
});

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  accessKeyId: api.AWS.AWS_ACCESS_KEY,
  secretAccessKey: api.AWS.AWS_SECRET_ACCESS_KEY,
  region: api.AWS.AWS_SNS_REGION,
});

const Phaxio = require('phaxio');

const phaxio = new Phaxio(
  api.PHAXIO.PHAXIO_API_KEY,
  api.PHAXIO.PHAXIO_API_SECRET
);

const mailcomposer = require('mailcomposer');

mongoose
  .connect(DB_PORT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connecting to database successful'))
  .catch((err) => console.error('Could not connect to mongo DB', err));

const Customer = require('../models/customer');

const create = async (req, res) => {
  const { currentUser } = req;
  const customer = new Customer({
    user: mongoose.Types.ObjectId('60e66a323d099c05a09efe01'),
    firstName: 'Garett',
    lastName: 'Steve',
    email: 'gsteve@gmail.com',
  });

  customer.save().catch((err) => {
    console.log('customer save err', err.message);
  });
};

const sendEmail = () => {
  return Promise.resolve().then(() => {
    let sendRawEmailPromise;

    const mail = mailcomposer({
      from: 'support@crmgrow.com',
      to: 'super@crmgrow.com',
      subject: 'Sample SES message with attachment',
      text: 'Hey folks, this is a test message from SES with an attachment.',
      attachments: [
        {
          path: '../blob.pdf',
        },
      ],
    });

    return new Promise((resolve, reject) => {
      mail.build((err, message) => {
        console.log('message', message);
        if (err) {
          reject(`Error sending raw email: ${err}`);
        }
        sendRawEmailPromise = ses
          .sendRawEmail({ RawMessage: { Data: message } })
          .promise()
          .then(() => {
            console.log('email sent');
          })
          .catch(() => {
            console.log('email send err', err);
          });
      });

      resolve(sendRawEmailPromise);
    });
  });
};

const sendText = () => {
  const smsParams = {
    Message: 'Hi',
    PhoneNumber: '+13127678603',
  };

  const sendPromise = sns.publish(smsParams).promise();
  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(function () {
      console.log('SEND SMS for user in 2 week');
    })
    .catch(function (err) {
      console.error(err);
    });
};

const sendFaq = () => {
  phaxio
    .sendFax({
      to: 'aPhoneNumber',
      filename: ['/path/to/a/supported/file'],
    })
    .then(function () {});
};

// sendEmail();
sendText();
// sendFaq;

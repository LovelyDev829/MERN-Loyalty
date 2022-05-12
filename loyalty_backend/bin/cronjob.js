/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { DB_PORT } = require('../config/database');
const moment = require('moment');
const mailcomposer = require('mailcomposer');
const system_settings = require('../config/system_settings');

/**
 * Connect Monogo Database.
 */

mongoose.set('useCreateIndex', true);

mongoose
  .connect(DB_PORT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connecting to database successful'))
  .catch((err) => console.error('Could not connect to mongo DB', err));
const AWS = require('aws-sdk');
const api = require('../config/api');

const ses = new AWS.SES({
  accessKeyId: api.AWS.AWS_ACCESS_KEY,
  secretAccessKey: api.AWS.AWS_SECRET_ACCESS_KEY,
  region: api.AWS.AWS_SES_REGION,
  apiVersion: '2010-12-01',
});

// const { FILES_PATH } = require('../config/path');
const Notification = require('../models/notification');
const Garbage = require('../models/garbage');
const Shipment = require('../models/shipment');
const Customer = require('../models/customer');
const Inventory = require('../models/inventory');
const User = require('../models/user');
const ServicePackage = require('../models/service_package');
const Warehouse = require('../models/warehouse');
const Vendor = require('../models/vendor');
const Driver = require('../models/driver');
const CustomerRepresentative = require('../models/customer_representative');

// const phaxio = new Phaxio(
//   api.PHAXIO.PHAXIO_API_KEY,
//   api.PHAXIO.PHAXIO_API_SECRET
// );
const front = require('../constants/urls');

var CronJob = require('cron').CronJob;

const processANotification = async (title, description, refURL) => {
  try {
    const query = [];

    query.push({
      $match: {
        $or: [
          {
            isEmailAllowed: true,
          },
          {
            isNotificationAllowed: true,
          },
          {
            isTextAllowed: true,
          },
        ],
        // del: false,
      },
    });

    query.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    });

    const garbages = await Garbage.aggregate(query).exec();
    console.log('>>> processANotification(), query, garbages', query, garbages);
    garbages.forEach(sfn => {
      if (sfn.isNotificationAllowed && sfn.user && sfn.user.length > 0) {
        const notificationObj = new Notification({
          user: mongoose.Types.ObjectId(sfn.user[0]._id),
          title,
          description,
          refURL,
        });
        try {
          notificationObj.save();
        } catch(err) {}  
      }
      if (sfn.isEmailAllowed && sfn.user && sfn.user.length > 0) {
        // sendEmail() to sfn.user.email
        const mail = mailcomposer({
          from: system_settings.REPLY_EMAIL,
          to: sfn.user[0].email,
          subject: 'Notification from Loyalty',
          text: sfn.title + '\n\n' + sfn.description + `\n\n <a href="${front.FRONTEND_URL}${sfn.refURL}>Click here to view the details</a>`,
        });
        mail.build((err, message) => {
          if (err) {
            console.log('>>> mail.build, sfn.user.email, err', sfn.user[0].email, err);
            // reject(`Error sending raw email: ${err}`);
          }
          console.log('>>> mail.build success, sfn.user.email, message', sfn.user[0].email, message);
          // sendRawEmailPromise = ses
          //   .sendRawEmail({ RawMessage: { Data: message } })
          //   .promise();
          ses.sendRawEmail({ RawMessage: { Data: message } });
        });
      }
    });
  } catch (ex) {}
};

const addShipmentNotification = async () => {
  console.log('>>> addShipmentNotification() called');

  try {
    const query = [];

    var date = new Date();
    date.setHours(0, 0, 0, 0);
    const numberOfDateDiff = 5;
    var datediff = new Date(date.getTime());
    datediff.setDate(datediff.getDate() + numberOfDateDiff);

    console.log('>>> addShipmentNotification(), date, datediff, date.toISOString(), datediff.toISOString()', date, datediff, date.toISOString(), datediff.toISOString());
    query.push({
      $match: {
        dueStart: {
          $gte: new Date(date), 
          $lt: new Date(datediff)
        }
      },
    });


    // get the total count
    query.push({
      $count: 'totalCount',
    });
    const response = await Shipment.aggregate(query).exec();

    // console.log('>>> addShipmentNotification(), query', query);

    let totalCount = 0;
    if (response.length > 0) {
      totalCount = response[0].totalCount;
    }
    query.pop();

    if (totalCount > 0) {
      const shipments = await Shipment.aggregate(query).exec();

      // console.log('>>> addShipmentNotification, totalCount, shipments', totalCount, shipments);

      for( var i = 0; i < shipments.length; i++) {
        const shipment = shipments[i];
        var dateString = moment(shipment.dueStart).format('YYYY-MM-DD');
        var refURL = `/app/management/shipments/${shipment._id}/1`;

        processANotification(
          shipment.type === '1' ? 'Upcoming Shipment Pickup Date' : 'Upcoming Service Pickup Date',
          'Pickup Date is ' + dateString,
          refURL
        )
      }
    }

  } catch (ex) {
    console.log('>>> error', ex);
  }
};
// var job = new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
// var job = new CronJob('*/10 * * * * *', addShipmentNotification);
// console.log('>>> front, front.FRONTEND_URL', front, front.FRONTEND_URL);
var job = new CronJob('0 16 * * *', addShipmentNotification);
job.start();

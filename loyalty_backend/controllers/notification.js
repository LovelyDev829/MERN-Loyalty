/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const moment = require('moment');

const Notification = require('../models/notification');
const Shipment = require('../models/shipment');

const get = async (req, res) => {
  // const { currentUser } = req;
  const notification = await Notification.findOne({
    // user: currentUser.id,
    _id: req.params.id,
  });

  if (!notification) {
    return res.status(400).json({
      status: false,
      error: 'Notification doesn`t exist',
    });
  }

  return res.send({
    status: true,
    notification,
  });
};

// get also
const getAlsoRelated = async (req, res) => {
  // const { currentUser } = req;
  const query = [];

  query.push({
    $match: {
      // user: mongoose.Types.ObjectId(currentUser.id),
      _id: mongoose.Types.ObjectId(req.params.id),
    },
  });

  query.push({
    $lookup: {
      from: 'customers',
      localField: 'customer',
      foreignField: '_id',
      as: 'customer',
    },
  });

  query.push({
    $lookup: {
      from: 'warehouses',
      localField: 'warehouse',
      foreignField: '_id',
      as: 'warehouse',
    },
  });

  query.push({
    $addFields: {
      totalCustomers: { $size: '$customer' },
      id: '$_id',
    },
  });

  const notifications = await Notification.aggregate(query).exec();

  if (notifications.length > 0) {
    return res.send({ notification: notifications[0] });
  }
  return res.send({ notification: null });
};

const getAll = async (req, res) => {
  const { currentUser } = req;
  let notifications = [];
  try {
    notifications = await Notification.find({
      user: currentUser.id,
    });
  } catch (ex) {}

  let countUnRead = 0;
  try {
    countUnRead = await Notification.count({
      user: currentUser.id,
      is_read: false,
    });
  } catch (ex) {}

  return res.send({
    status: true,
    notifications,
    totalCount: notifications.length,
    countUnRead,
  });
  // const notifications = [
  //   {
  //     id: '5e8883f1b51cc1956a5a1ec0',
  //     title: 'Your order is placed',
  //     description: 'Dummy text',
  //     type: 'order_placed',
  //     createdAt: moment()
  //       .subtract(2, 'hours')
  //       .toDate()
  //       .getTime()
  //   },
  //   {
  //     id: '5e8883f7ed1486d665d8be1e',
  //     title: 'New message received',
  //     description: 'You have 32 unread messages',
  //     type: 'new_message',
  //     createdAt: moment()
  //       .subtract(1, 'day')
  //       .toDate()
  //       .getTime()
  //   },
  //   {
  //     id: '5e8883fca0e8612044248ecf',
  //     title: 'Your item is shipped',
  //     description: 'Dummy text',
  //     type: 'item_shipped',
  //     createdAt: moment()
  //       .subtract(3, 'days')
  //       .toDate()
  //       .getTime()
  //   },
  //   {
  //     id: '5e88840187f6b09b431bae68',
  //     title: 'New message received',
  //     description: 'You have 32 unread messages',
  //     type: 'new_message',
  //     createdAt: moment()
  //       .subtract(7, 'days')
  //       .toDate()
  //       .getTime()
  //   }
  // ];
  // return res.send({
  //   status: true,
  //   notifications,
  //   totalCount: 5,
  // });
}
const markAllAsRead = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> markAllAsRead(), currentUser.id', currentUser.id);
  Notification.updateMany(
    {
      // _id: req.params.id,
      user: mongoose.Types.ObjectId(currentUser.id),
    },
    {
      $set: {
        is_read: true,
      },
    },
    {upsert: false},
    )
    .then(() => {
      res.send({
        status: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'Notification Update Error',
      });
    });
}
const create = (req, res) => {
  const { currentUser } = req;
  const notificationObj = new Notification({
    ...req.body,
    user: currentUser.id,
  });

  console.log('>>> notification', req.body);
  console.log('>>> notificationObj', notificationObj);
  try {
    notificationObj.save();
  } catch(err) {
    return res.send({
      status: false,
    });
  }

  return res.send({
    status: true,
  });
};

const loadByQuery = async (req, res) => {
  // const { currentUser } = req;
  const { searchText, customer_id, page, limit } = req.body;
  /**
   * 1. Alphabetical A-Z
   * 2. Alphabetical Z-A
   */
  let { includePackingList } = req.body;
  if (includePackingList === undefined) {
    includePackingList = false;
  }
  const sort = Number.parseInt(req.body.sort);

  const query = [];

  if (!includePackingList) {
    query.push({
      $match: {
        notificationStr: '', 
      },
    });
  }

  if (searchText) {
    query.push({
      $match: {
        $or: [
          {
            itemNumber: { $regex: searchText + '.*', $options: 'i' },
          },
          {
            pieces: { $regex: searchText + '.*', $options: 'i' },
          },
          {
            type: { $regex: searchText + '.*', $options: 'i' },
          },
          {
            description: { $regex: searchText + '.*', $options: 'i' },
          },
        ],
      },
    });
  }

  if (customer_id !== '') {
    query.push({
      $match: {
        customer: mongoose.Types.ObjectId(customer_id),
      },
    });  
  }

  query.push({
    $lookup: {
      from: 'customers',
      localField: 'customer',
      foreignField: '_id',
      as: 'customer',
    },
  });

  query.push({
    $lookup: {
      from: 'warehouses',
      localField: 'warehouse',
      foreignField: '_id',
      as: 'warehouse',
    },
  });

  query.push({
    $addFields: {
      id: '$_id',
    },
  });

  // get the total count
  query.push({
    $count: 'totalCount',
  });
  const response = await Notification.aggregate(query).exec();

  let totalCount = 0;
  if (response.length > 0) {
    totalCount = response[0].totalCount;
  }
  query.pop();

  query.push({
    $sort: {
      description: sort === 1 ? 1 : -1,
    },
  });
  
  const skip = page * limit;
  if (skip > 0) {
    query.push({
      $skip: skip,
    });
  }
  query.push({
    $limit: limit,
  });

  const notifications = await Notification.aggregate(query).exec();
  return res.send({
    status: true,
    notifications,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.params.id', req.params.id);
  console.log('>>> req.body', req.body);
  Notification.updateOne(
    {
      _id: req.params.id,
      // user: currentUser.id,
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
        notification: req.body,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'Notification Update Error',
      });
    });
};

const remove = (req, res) => {
  // const { currentUser } = req;

  Notification.deleteOne({
    _id: req.params.id,
    // user: currentUser.id,
  })
    .then(() => {
      return res.send({
        status: true,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        error: err.message || 'Notification Delete Error',
      });
    });
};

const createBulk = async (req, res) => {
  const { currentUser } = req;
  const { notifications } = req.body;
  const { notificationType } = req.body;
  const { shipment } = req.body;
  const { customer } = req.body;

  console.log('>>> notifications, notificationType, shipment, customer', notifications, notificationType, shipment, customer);

  try {
    await Notification.deleteMany({
      notificationType,
      shipment,
    });
  } catch (err) {
    return res.send({
      status: false,
      error: err.message || 'Can\t delete old notifications',
    });
  }

  for (const notification of notifications) {
    let isEmptyRow = true;
    for (const key in notification) {
      console.log(`${key}: ${notification[key]}`);
      if (notification[key] && notification[key].length > 0) {
        isEmptyRow = false;
        break;
      }
    }

    if (isEmptyRow) continue;
    if (notification.notificationStr && notification.notificationStr.length > 0) {
      // from Packing List
      continue;
    }

    const tmp = notification.warehouse;
    let idValue = '';
    let contentValue = '';
    if (tmp) {
      const arr = tmp.split('***');
      if (arr.length >= 2) {
        [idValue, contentValue] = arr;
      }
    }

    const notificationObj = new Notification({
      ...notification,
      user: currentUser.id,
      notificationType,
      shipment,
      customer,
      warehouse: idValue,
    });

    try {
      notificationObj.save();
    } catch(err) {
      return res.send({
        status: false,
      });
    }
  }

  // set isReceiverCreated for the shipment
  try {
    await Shipment.findOneAndUpdate(
      {
        _id: shipment,
      },
      {
        $set: {
          isReciverCreated: true,
        },
      },
      {
        upsert: false,
      }
    );
  } catch(err) {
    console.log('>>> err', err);
    return res.send({
      status: false,
      error: 'error on setting isReciverCreated',
    });
  }

  return res.send({
    status: true,
  });
};

module.exports = {
  get,
  getAlsoRelated,
  getAll,
  loadByQuery,
  create,
  update,
  remove,
  createBulk,
  markAllAsRead,
};

const mongoose = require('mongoose');
const Customer = require('../models/customer');

const get = async (req, res) => {
  const { currentUser } = req;
  const customer = await Customer.findOne({
    // user: currentUser.id,
    _id: req.params.id,
  });

  if (!customer) {
    return res.status(400).json({
      status: false,
      error: 'Customer doesn`t exist',
    });
  }

  return res.send({
    status: true,
    customer,
  });
};

const create = async (req, res) => {
  const { currentUser } = req;
  const customer = new Customer({
    ...req.body,
    user: currentUser.id,
    fullName: req.body.firstName + ' ' + req.body.lastName,
  });
  customer.save().catch((err) => {
    console.log('customer save err', err.message);
  });

  return res.send({
    status: true,
  });
};

const getEasySearch = async (req, res) => {
  const { currentUser } = req;
  const search_text = req.body.search_text;
  const page = Number.parseInt(req.body.page);
  const limit = Number.parseInt(req.body.limit);
  // build condition
  const condition = {
    // user: currentUser.id,
  };
  if (search_text !== undefined && search_text.length > 0) {
    condition['$or'] = [
      {
        firstName: { $regex: search_text + '.*', $options: 'i' },
      },
      {
        lastName: { $regex: search_text + '.*', $options: 'i' },
      },
      {
        fullName: { $regex: search_text + '.*', $options: 'i' },
      },
      {
        email: { $regex: search_text + '.*', $options: 'i' },
      },
    ];
  }
  const customers = await Customer.find(condition)
    .sort({ firstName: 1 })
    .skip(page * limit)
    .limit(limit);
  return res.send({
    status: true,
    customers,
  });
};

const loadByQuery = async (req, res) => {
  const { currentUser } = req;
  const { searchText, isActive, page, limit } = req.body;

  /**
   * 1. Active
   * 2. Total Shipment
   * 3. Alphabetical A-Z
   */
  const sort = Number.parseInt(req.body.sort);

  const query = [];

  if (searchText) {
    // Active
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
            fullName: { $regex: searchText + '.*', $options: 'i' },
          },
          {
            email: { $regex: searchText + '.*', $options: 'i' },
          },
          {
            company: { $regex: searchText + '.*', $options: 'i' },
          },
          {
            fullAddr: { $regex: searchText + '.*', $options: 'i' },
          },
        ],
        // user: mongoose.Types.ObjectId(currentUser.id),
      },
    });
  } else {
    // query.push({
    //   $match: {
    //     user: mongoose.Types.ObjectId(currentUser.id),
    //   },
    // });
  }

  query.push({
    $lookup: {
      from: 'shipments',
      localField: '_id',
      foreignField: 'customer',
      as: 'shipments',
    },
  });
  query.push({
    $addFields: {
      totalShipments: {
        $size: '$shipments',
      },
    },
  });
  query.push({
    $project: {
      shipments: 0,
    },
  });

  if (sort === 1) {
    // Alphabetical A-Z
    query.push({
      $sort: {
        firstName: 1,
        lastName: 1,
      },
    });
  } else if (sort === 2) {
    // Total Shipment
    query.push({
      $sort: {
        totalShipments: -1,
        firstName: 1,
        lastName: 1,
      },
    });
  }

  if (isActive) {
    query.push({
      $match: {
        isActive,
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
  const response = await Customer.aggregate(query).exec();

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

  const customers = await Customer.aggregate(query).exec();
  return res.send({
    status: true,
    customers,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;

  Customer.updateOne(
    {
      _id: req.params.id,
      // user: currentUser.id,
    },
    {
      $set: {
        ...req.body,
        fullName: req.body.firstName + ' ' + req.body.lastName,
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
        error: err.message || 'Customer Update Error',
      });
    });
};

const remove = (req, res) => {
  const { currentUser } = req;

  Customer.deleteOne({
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
        error: err.message || 'Customer Delete Error',
      });
    });
};

module.exports = {
  get,
  create,
  update,
  remove,
  loadByQuery,
  getEasySearch,
};

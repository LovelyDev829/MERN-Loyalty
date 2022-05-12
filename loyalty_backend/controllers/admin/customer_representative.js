const mongoose = require('mongoose');
const CustomerRepresentative = require('../../models/customer_representative');

const get = async (req, res) => {
  const customerRepresentative = await CustomerRepresentative.findOne({
    _id: req.params.id,
  });

  if (!customerRepresentative) {
    return res.status(400).json({
      status: false,
      error: 'CustomerRepresentative doesn`t exist',
    });
  }

  return res.send({
    status: true,
    customerRepresentative,
  });
};

const create = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.body', req.body);

  const customerRepresentative = new CustomerRepresentative({
    ...req.body,
    user: currentUser.id,
  });
  console.log('>>> customerRepresentative create, req.body', req.body);
  customerRepresentative.save().catch((err) => {
    console.log('customerRepresentative save err', err.message);
  });

  return res.send({
    status: true,
  });
};

const loadByQuery = async (req, res) => {
  const { searchText, status, page, limit } = req.body;
  const condition = {};
  if (searchText !== undefined && searchText.length > 0) {
    condition['$or'] = [
      {
        name: { $regex: searchText + '.*', $options: 'i' },
      },
      {
        fullAddr: { $regex: searchText + '.*', $options: 'i' },
      },
      {
        email: { $regex: searchText + '.*', $options: 'i' },
      },
    ];
  }

  const totalCount = await CustomerRepresentative.find(condition).count();

  console.log('>>> totalCount', totalCount);
  // {
  //   value: '1',
  //   label: 'Alphabetical A-Z'
  // },
  // {
  //   value: '2',
  //   label: 'Alphabetical Z-A'
  // },
  const sortOption = {};
  if (status === '1') {
    sortOption.name = 1;
  } else if (status === '2') {
    sortOption.name = -1;
  }
  const customerRepresentatives = await CustomerRepresentative.find(condition)
    .sort(sortOption)
    .skip(page * limit)
    .limit(limit);
  return res.send({
    status: true,
    customerRepresentatives,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.body', req.body);
  CustomerRepresentative.updateOne(
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
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'CustomerRepresentative Update Error',
      });
    });
};

const remove = (req, res) => {
  const { currentUser } = req;

  CustomerRepresentative.deleteOne({
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
        error: err.message || 'CustomerRepresentative Delete Error',
      });
    });
};

module.exports = {
  get,
  create,
  update,
  remove,
  loadByQuery,
};

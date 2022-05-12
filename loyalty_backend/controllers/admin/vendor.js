const mongoose = require('mongoose');
const Vendor = require('../../models/vendor');

const get = async (req, res) => {
  const vendor = await Vendor.findOne({
    _id: req.params.id,
  });

  if (!vendor) {
    return res.status(400).json({
      status: false,
      error: 'Vendor doesn`t exist',
    });
  }

  return res.send({
    status: true,
    vendor,
  });
};

const create = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.body', req.body);

  const vendor = new Vendor({
    ...req.body,
    user: currentUser.id,
  });
  console.log('>>> vendor create, req.body', req.body);
  vendor.save().catch((err) => {
    console.log('vendor save err', err.message);
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

  const totalCount = await Vendor.find(condition).count();

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
  const vendors = await Vendor.find(condition)
    .sort(sortOption)
    .skip(page * limit)
    .limit(limit);
  return res.send({
    status: true,
    vendors,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.body', req.body);
  Vendor.updateOne(
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
        error: err.message || 'Vendor Update Error',
      });
    });
};

const remove = (req, res) => {
  const { currentUser } = req;

  Vendor.deleteOne({
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
        error: err.message || 'Vendor Delete Error',
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

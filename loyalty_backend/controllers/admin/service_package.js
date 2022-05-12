const mongoose = require('mongoose');
const ServicePackage = require('../../models/service_package');

const get = async (req, res) => {
  const servicePackage = await ServicePackage.findOne({
    _id: req.params.id,
  });

  if (!servicePackage) {
    return res.status(400).json({
      status: false,
      error: 'ServicePackage doesn`t exist',
    });
  }

  return res.send({
    status: true,
    servicePackage,
  });
};

const create = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.body', req.body);

  const { unitPrice } = req.body;

  const servicePackage = new ServicePackage({
    ...req.body,
    user: currentUser.id,
    unitPrice: parseFloat(unitPrice),
  });
  console.log('>>> service package create, req.body', req.body);
  servicePackage.save().catch((err) => {
    console.log('servicePackage save err', err.message);
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
        description: { $regex: searchText + '.*', $options: 'i' },
      },
      {
        notes: { $regex: searchText + '.*', $options: 'i' },
      },
    ];
  }

  const totalCount = await ServicePackage.find(condition).count();

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
    sortOption.description = 1;
  } else if (status === '2') {
    sortOption.description = -1;
  }
  const servicePackages = await ServicePackage.find(condition)
    .sort(sortOption)
    .skip(page * limit)
    .limit(limit);
  return res.send({
    status: true,
    servicePackages,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.body', req.body);
  ServicePackage.updateOne(
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
        error: err.message || 'ServicePackage Update Error',
      });
    });
};

const remove = (req, res) => {
  const { currentUser } = req;

  ServicePackage.deleteOne({
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
        error: err.message || 'ServicePackage Delete Error',
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

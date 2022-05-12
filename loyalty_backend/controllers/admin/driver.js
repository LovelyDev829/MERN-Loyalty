/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const Driver = require('../../models/driver');

const get = async (req, res) => {
  // const { currentUser } = req;
  const driver = await Driver.findOne({
    // user: currentUser.id,
    _id: req.params.id,
  });

  if (!driver) {
    return res.status(400).json({
      status: false,
      error: 'Driver doesn`t exist',
    });
  }

  return res.send({
    status: true,
    driver,
  });
};

const create = (req, res) => {
  const { currentUser } = req;

  const driverObj = new Driver({
    ...req.body,
    user: currentUser.id,
  });

  try {
    driverObj.save();
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
  const { searchText, page, limit } = req.body;
  /**
   * 1. Alphabetical A-Z
   * 2. Alphabetical Z-A
   */
  const sort = Number.parseInt(req.body.sort);

  const condition = {};
  if (searchText !== undefined && searchText.length > 0) {
    condition['$or'] = [
      {
        name: { $regex: searchText + '.*', $options: 'i' },
      },
      {
        phone: { $regex: searchText + '.*', $options: 'i' },
      },
    ];
  }

  const totalCount = await Driver.find(condition).count();

  console.log('>>> totalCount', totalCount);

  const sortOption = {};
  if (sort === 1) {
    sortOption.name = 1;
  } else if (sort === 2) {
    sortOption.name = -1;
  }
  const drivers = await Driver.find(condition)
    .sort(sortOption)
    .skip(page * limit)
    .limit(limit);
  return res.send({
    status: true,
    drivers,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> ...req.body', req.body);
  Driver.updateOne(
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
        driver: req.body,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'Driver Update Error',
      });
    });
};

const remove = (req, res) => {
  // const { currentUser } = req;

  Driver.deleteOne({
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
        error: err.message || 'Driver Delete Error',
      });
    });
};

const setDefault = async (req, res) => {
  const { isDefault } = req.body;

  try{
    await Driver.updateMany(
      {
        // _id: req.params.id,
      },
      {
        $set: {
          isDefault: false,
        },
      },
      {upsert: false},
    );
  } catch (e) {
    res.status(500).json({
      status: false,
      error: e.message || 'Driver Update Error',
    });
  }

  if (isDefault) {
    Driver.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          isDefault,
        },
      }
    )
      .then(() => {
        res.send({
          status: true,
          driver: req.body,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          error: err.message || 'Driver Update Error',
        });
      });  
  } else {
    res.send({
      status: true,
      driver: req.body,
    });
  }
};

module.exports = {
  get,
  loadByQuery,
  create,
  update,
  remove,
  setDefault,
};

/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const Warehouse = require('../../models/warehouse');

const get = async (req, res) => {
  // const { currentUser } = req;
  const warehouse = await Warehouse.findOne({
    // user: currentUser.id,
    _id: req.params.id,
  });

  if (!warehouse) {
    return res.status(400).json({
      status: false,
      error: 'Warehouse doesn`t exist',
    });
  }

  return res.send({
    status: true,
    warehouse,
  });
};

const create = (req, res) => {
  const { currentUser } = req;

  const warehouseObj = new Warehouse({
    ...req.body,
    user: currentUser.id,
  });

  try {
    warehouseObj.save();
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
        fullAddr: { $regex: searchText + '.*', $options: 'i' },
      },
      {
        contactName: { $regex: searchText + '.*', $options: 'i' },
      },
      {
        contactEmail: { $regex: searchText + '.*', $options: 'i' },
      },
    ];
  }

  const totalCount = await Warehouse.find(condition).count();

  console.log('>>> totalCount', totalCount);

  const sortOption = {};
  if (sort === 1) {
    sortOption.name = 1;
  } else if (sort === 2) {
    sortOption.name = -1;
  }
  const warehouses = await Warehouse.find(condition)
    .sort(sortOption)
    .skip(page * limit)
    .limit(limit);
  return res.send({
    status: true,
    warehouses,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> ...req.body', req.body);
  Warehouse.updateOne(
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
        warehouse: req.body,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'Warehouse Update Error',
      });
    });
};

const remove = (req, res) => {
  // const { currentUser } = req;

  Warehouse.deleteOne({
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
        error: err.message || 'Warehouse Delete Error',
      });
    });
};

const setDefault = async (req, res) => {
  const { isDefault } = req.body;

  try{
    await Warehouse.updateMany(
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
      error: e.message || 'Warehouse Update Error',
    });
  }

  if (isDefault) {
    Warehouse.updateOne(
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
          warehouse: req.body,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          error: err.message || 'Warehouse Update Error',
        });
      });  
  } else {
    res.send({
      status: true,
      warehouse: req.body,
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

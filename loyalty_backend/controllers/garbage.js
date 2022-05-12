/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const Garbage = require('../models/garbage');

const get = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> get(), currentUser.id', currentUser.id);
  const garbage = await Garbage.findOne({
    // user: currentUser.id,
    user: currentUser.id,
  });

  if (!garbage) {
    return res.status(400).json({
      status: false,
      error: 'Garbage doesn`t exist',
    });
  }

  return res.send({
    status: true,
    garbage,
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

  const garbage = await Garbage.aggregate(query).exec();

  if (garbage.length > 0) {
    return res.send({ garbage: garbage[0] });
  }
  return res.send({ garbage: null });
};

const create = (req, res) => {
  const { currentUser } = req;
  const garbageObj = new Garbage({
    ...req.body,
    user: currentUser.id,
  });

  console.log('>>> garbage', req.body);
  console.log('>>> garbageObj', garbageObj);
  try {
    garbageObj.save();
  } catch(err) {
    return res.send({
      status: false,
    });
  }

  return res.send({
    status: true,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;

  const recordData = {
    ...req.body,
    user: currentUser.id,
  };

  console.log('>>> recordData', recordData);
  try {
    await Garbage.findOneAndUpdate(
      {
        user: currentUser.id,
      },
      {
        $set: recordData,
      },
      {
        upsert: true,
      }
    );
  } catch(err) {
    console.log('>>> err', err);
    return res.send({
      status: false,
      error: 'garbage create error',
    });
  }
  // return Success
  res.send({
    status: true,
  });
};

const remove = (req, res) => {
  // const { currentUser } = req;

  Garbage.deleteOne({
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
        error: err.message || 'Garbage Delete Error',
      });
    });
};


module.exports = {
  get,
  getAlsoRelated,
  create,
  update,
  remove,
};

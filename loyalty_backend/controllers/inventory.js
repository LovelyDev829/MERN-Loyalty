/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const Inventory = require('../models/inventory');
const Shipment = require('../models/shipment');

const get = async (req, res) => {
  // const { currentUser } = req;
  const inventory = await Inventory.findOne({
    // user: currentUser.id,
    _id: req.params.id,
  });

  if (!inventory) {
    return res.status(400).json({
      status: false,
      error: 'Inventory doesn`t exist',
    });
  }

  return res.send({
    status: true,
    inventory,
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

  const inventories = await Inventory.aggregate(query).exec();

  if (inventories.length > 0) {
    return res.send({ inventory: inventories[0] });
  }
  return res.send({ inventory: null });
};

const create = (req, res) => {
  const { currentUser } = req;
  const { inventory } = req.body;

  const inventoryObj = new Inventory({
    ...req.body,
    user: currentUser.id,
  });

  console.log('>>> inventory', req.body);
  console.log('>>> inventoryObj', inventoryObj);
  try {
    inventoryObj.save();
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
        inventoryStr: '', 
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

    // query.push({
    //   $lookup: {
    //     from: 'customers',
    //     let: {customer_id: "$customer"},
    //     pipeline: [
    //       {
    //         $match: 
    //         {
    //           $expr:
    //           {
    //             $and:
    //             [
    //               {
    //                 $regexMatch: {
    //                   input: "$firstName",
    //                   regex: searchText + '.*',
    //                   options: "i"
    //                 }
    //               },
    //               {$eq: ["$_id", "$$customer_id"]}
    //             ]
    //           }
    //         }
    //       }
    //     ],
    //     as: 'customerArr',
    //   }
    // });
    // query.push({
    //   $match: {
    //     $expr: {
    //       $gt: [
    //         {$size: "$customerArr"}, 0
    //       ]
    //     }
    //   }
    // });
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
  const response = await Inventory.aggregate(query).exec();

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

  const inventories = await Inventory.aggregate(query).exec();
  return res.send({
    status: true,
    inventories,
    totalCount,
  });
};

const update = async (req, res) => {
  const { currentUser } = req;
  console.log('>>> req.params.id', req.params.id);
  console.log('>>> req.body', req.body);
  Inventory.updateOne(
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
        inventory: req.body,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        error: err.message || 'Inventory Update Error',
      });
    });
};

const remove = (req, res) => {
  // const { currentUser } = req;

  Inventory.deleteOne({
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
        error: err.message || 'Inventory Delete Error',
      });
    });
};

const createBulk = async (req, res) => {
  const { currentUser } = req;
  const { inventories } = req.body;
  const { inventoryType } = req.body;
  const { shipment } = req.body;
  const { customer } = req.body;

  console.log('>>> inventories, inventoryType, shipment, customer', inventories, inventoryType, shipment, customer);

  try {
    await Inventory.deleteMany({
      inventoryType,
      shipment,
    });
  } catch (err) {
    return res.send({
      status: false,
      error: err.message || 'Can\t delete old inventories',
    });
  }

  for (const inventory of inventories) {
    let isEmptyRow = true;
    for (const key in inventory) {
      console.log(`${key}: ${inventory[key]}`);
      if (inventory[key] && inventory[key].length > 0) {
        isEmptyRow = false;
        break;
      }
    }

    if (isEmptyRow) continue;
    if (inventory.inventoryStr && inventory.inventoryStr.length > 0) {
      // from Packing List
      continue;
    }

    const tmp = inventory.warehouse;
    let idValue = '';
    let contentValue = '';
    if (tmp) {
      const arr = tmp.split('***');
      if (arr.length >= 2) {
        [idValue, contentValue] = arr;
      }
    }

    const inventoryObj = new Inventory({
      ...inventory,
      user: currentUser.id,
      inventoryType,
      shipment,
      customer,
      warehouse: idValue,
    });

    try {
      inventoryObj.save();
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

const loadByQueryTransaction = async (req, res) => {
  // const { currentUser } = req;
  const { searchText, inventory_id, page, limit, onhand } = req.body;

  const query = [];

  query.push({
    $match: {
      inventoryStr: { $ne: '' },
      inventory: mongoose.Types.ObjectId(inventory_id),
    },
  });

  if (searchText) {
    query.push({
      $match: {
        $or: [
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

  query.push({
    $lookup: {
      from: 'shipments',
      localField: 'shipment',
      foreignField: '_id',
      as: 'shipment',
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
    $addFields: {
      id: '$_id',
    },
  });

  // get the total count
  query.push({
    $count: 'totalCount',
  });
  const response = await Inventory.aggregate(query).exec();

  let totalCount = 0;
  if (response.length > 0) {
    totalCount = response[0].totalCount;
  }
  query.pop();

  query.push({
    $sort: { updatedAt: 1 },
  });

  // const skip = page * limit;
  // if (skip > 0) {
  //   query.push({
  //     $skip: skip,
  //   });
  // }

  // query.push({
  //   $limit: limit,
  // });

  console.log('>>> query', query);

  const inventories = await Inventory.aggregate(query).exec();

  console.log('>>> inventories', inventories);
  let onhandChange = parseInt(onhand, 10);
  if (isNaN(onhandChange)) {
    onhandChange = 0;
  }

  const inventoriesToReturn = [];
  for ( const inventory of inventories) {
    let val = parseInt(inventory.pieces, 10);
    if (isNaN(val)) {
      val = 0;
    }
    onhandChange -= val;
    inventory.onhand = onhandChange;
    inventoriesToReturn.push(inventory);
  }

  return res.send({
    status: true,
    inventories: inventoriesToReturn,
    totalCount,
  });
};

module.exports = {
  get,
  getAlsoRelated,
  loadByQuery,
  create,
  update,
  remove,
  createBulk,
  loadByQueryTransaction,
};

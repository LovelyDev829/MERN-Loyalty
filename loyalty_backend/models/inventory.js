const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const InventorySchema = new Schema(
  {
    lglNumber: String,
    itemNumber: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'shipment' },
    inventoryType: { type: String, default: '' },
    del: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    pieces: String,
    type: String,
    description: String,
    l: String,
    w: String,
    h: String,
    weight: String,
    UOM: String,
    cases: Number,
    createdAt: Date,
    updatedAt: Date,
    inventoryStr: { type: String, default: '' },
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'inventory' },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'warehouse' },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

InventorySchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

InventorySchema.index({ itemNumber: 1, pieces: 1, type: 1, description: 1 });

const Inventory = mongoose.model('inventory', InventorySchema);

module.exports = Inventory;

const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const WarehouseSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: String,
    fullAddr: String,
    aptSuite: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    del: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

WarehouseSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

WarehouseSchema.index({
  name: 1,
  fullAddr: 1,
  contactName: 1,
  contactEmail: 1,
});

const Warehouse = mongoose.model('warehouse', WarehouseSchema);

module.exports = Warehouse;

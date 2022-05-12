const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const DriverSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: String,
    phone: String,
    createdAt: Date,
    updatedAt: Date,
    isActive: { type: Boolean, default: true },
    del: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

DriverSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

DriverSchema.index({ name: 1, phone: 1 });

const Driver = mongoose.model('driver', DriverSchema);

module.exports = Driver;

const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const ServicePackageSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    description: String,
    unitPrice: { type: mongoose.Schema.Types.Double, default: 0.0 },
    currency: String,
    note: String,
    createdAt: Date,
    updatedAt: Date,
    isActive: { type: Boolean, default: false },
    del: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

ServicePackageSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

ServicePackageSchema.index({ description: 1, notes: 1 });

const ServicePackage = mongoose.model('servicePackage', ServicePackageSchema);

module.exports = ServicePackage;

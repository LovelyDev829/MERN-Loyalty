const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const VendorSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: String,
    phone: String,
    email: String,
    fax: String,
    fullAddr: String,
    aptSuite: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    createdAt: Date,
    updatedAt: Date,
    del: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

VendorSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

VendorSchema.index({ name: 1, fullAddr: 1, email: 1 });

const Vendor = mongoose.model('vendor', VendorSchema);

module.exports = Vendor;

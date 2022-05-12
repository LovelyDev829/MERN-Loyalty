const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    fullName: String,
    company: String,
    email: String,
    phone: String,
    fax: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    fullAddr: String,
    aptSuite: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    del: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

CustomerSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

CustomerSchema.index({
  user: 1,
  firstName: 1,
  lastName: 1,
  fullName: 1,
  email: 1,
  company: 1,
  fullAddr: 1,
});
// CustomerSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

const Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;

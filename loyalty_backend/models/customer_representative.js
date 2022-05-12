const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const CustomerRepresentativeSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: String,
    phone: String,
    email: String,
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

CustomerRepresentativeSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

CustomerRepresentativeSchema.index({ name: 1, fullAddr: 1, email: 1 });

const CustomerRepresentative = mongoose.model(
  'customerRepresentative',
  CustomerRepresentativeSchema
);

module.exports = CustomerRepresentative;

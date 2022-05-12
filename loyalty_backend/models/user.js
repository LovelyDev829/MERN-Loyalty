const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    hash: String,
    salt: String,
    createdAt: Date,
    updatedAt: Date,
    fullAddr: String,
    aptSuite: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    role: String,
    verifiedEmail: { type: Boolean, default: false },
    del: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isReportsAccess: { type: Boolean, default: false },
    avatar: String,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

UserSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

UserSchema.index({ firstName: 1, lastName: 1, email: 1 });

const User = mongoose.model('user', UserSchema);

module.exports = User;

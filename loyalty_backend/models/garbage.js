const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GarbageSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    isEmailAllowed: { type: Boolean, default: false },
    isNotificationAllowed: { type: Boolean, default: false },
    isTextAllowed: { type: Boolean, default: false },
    del: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Export the model
module.exports = mongoose.model('garbage', GarbageSchema);

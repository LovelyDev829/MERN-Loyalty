const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    // shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'shipment' },
    is_read: { type: Boolean, default: false },
    type: String,
    title: String,
    description: String,
    refURL: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Export the model
module.exports = mongoose.model('Notification', NotificationSchema);

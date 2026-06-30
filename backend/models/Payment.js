const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Apple Pay', 'UPI'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Refunded', 'Failed'],
    default: 'Pending'
  },
  transactionReference: {
    type: String,
    unique: true
  }
}, { timestamps: true });

paymentSchema.pre('save', function (next) {
  if (!this.transactionReference) {
    this.transactionReference = 'TXN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);

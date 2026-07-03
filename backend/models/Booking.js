const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }],
  roomNumbers: [{ type: Number }],
  numberOfRooms: {
    type: Number,
    required: true,
    min: [1, 'Must book at least 1 room'],
    max: [5, 'Cannot book more than 5 rooms']
  },
  roomTier: {
    type: String,
    enum: ['Any', 'Standard', 'Deluxe', 'Premium', 'Suite'],
    default: 'Any'
  },
  acPreference: {
    type: String,
    enum: ['Any', 'AC', 'Non-AC'],
    default: 'Any'
  },
  checkIn: {
    type: Date,
    default: Date.now
  },
  checkOut: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 1 day stay
  },
  travelTime: {
    type: Number,
    default: 0
  },
  floorsSpanned: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  baseAmount: {
    type: Number,
    default: 0
  },
  gstAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  bookingReference: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Generate booking reference before save
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'HTL-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

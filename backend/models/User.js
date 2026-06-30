const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['Customer', 'Hotel Staff', 'Admin'],
    default: 'Customer'
  },
  loyalty_points: {
    type: Number,
    default: 0
  },
  membership_level: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  preferences: {
    roomType: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Premium', 'Suite', 'Any'],
      default: 'Any'
    },
    features: [String]
  }
}, { timestamps: true });

// Helper to update membership level based on loyalty points
userSchema.methods.updateMembershipLevel = function() {
  if (this.loyalty_points >= 1000) {
    this.membership_level = 'Platinum';
  } else if (this.loyalty_points >= 500) {
    this.membership_level = 'Gold';
  } else if (this.loyalty_points >= 200) {
    this.membership_level = 'Silver';
  } else {
    this.membership_level = 'Bronze';
  }
};

module.exports = mongoose.model('User', userSchema);

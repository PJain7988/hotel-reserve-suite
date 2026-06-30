const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true
  },
  floor: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  position: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Premium', 'Suite'],
    default: 'Standard'
  },
  price: {
    type: Number,
    required: true,
    default: 100
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Reserved', 'Maintenance'],
    default: 'Available'
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  features: {
    type: [String],
    default: []
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
}, { timestamps: true });

roomSchema.index({ floor: 1, position: 1 });

// Static method to initialize all 97 rooms with tier distributions
roomSchema.statics.initializeRooms = async function () {
  const count = await this.countDocuments();
  if (count === 97) return;

  await this.deleteMany({});
  const rooms = [];

  // Floors 1-9: 10 rooms each
  for (let floor = 1; floor <= 9; floor++) {
    for (let pos = 1; pos <= 10; pos++) {
      let roomType = 'Standard';
      let price = 100;
      let features = ['Wifi'];

      if (floor >= 4 && floor <= 6) {
        roomType = 'Deluxe';
        price = 180;
        features = ['Wifi', 'Mini Bar'];
      } else if (floor >= 7 && floor <= 9) {
        roomType = 'Premium';
        price = 280;
        features = ['Wifi', 'Mini Bar', 'Ocean View', 'Quiet'];
      }

      rooms.push({
        roomNumber: floor * 100 + pos,
        floor,
        position: pos,
        roomType,
        price,
        status: 'Available',
        isOccupied: false,
        features
      });
    }
  }

  // Floor 10: 7 rooms (Suite tier)
  for (let pos = 1; pos <= 7; pos++) {
    rooms.push({
      roomNumber: 1000 + pos,
      floor: 10,
      position: pos,
      roomType: 'Suite',
      price: 450,
      status: 'Available',
      isOccupied: false,
      features: ['Wifi', 'Mini Bar', 'Ocean View', 'Quiet', 'Jacuzzi', 'Connected']
    });
  }

  await this.insertMany(rooms);
  console.log('🏨 97 enterprise hotel rooms initialized across 10 floors');
};

module.exports = mongoose.model('Room', roomSchema);

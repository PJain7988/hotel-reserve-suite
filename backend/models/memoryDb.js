let rooms = [];
let bookings = [];
let users = [];
let payments = [];
let reviews = [];

// Initialize default mock users
function initializeUsers() {
  if (users.length > 0) return;
  users = [
    {
      _id: 'user_admin',
      name: 'Director Alexis',
      email: 'admin@hotelreserve.com',
      password: 'adminpassword',
      role: 'Admin',
      loyalty_points: 1200,
      membership_level: 'Platinum',
      preferences: { roomType: 'Suite', features: ['Quiet', 'Ocean View'] }
    },
    {
      _id: 'user_staff',
      name: 'Clerk Jonathan',
      email: 'staff@hotelreserve.com',
      password: 'staffpassword',
      role: 'Hotel Staff',
      loyalty_points: 0,
      membership_level: 'Bronze',
      preferences: { roomType: 'Any', features: [] }
    },
    {
      _id: 'user_vip',
      name: 'Lady Victoria',
      email: 'victoria@vip.com',
      password: 'vippassword',
      role: 'Customer',
      loyalty_points: 850,
      membership_level: 'Gold',
      preferences: { roomType: 'Premium', features: ['Ocean View', 'Quiet'] }
    }
  ];
}

// Initialize rooms
function initializeRooms() {
  if (rooms.length === 97) return;
  rooms = [];
  
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
        _id: `room_${floor}_${pos}`,
        roomNumber: floor * 100 + pos,
        floor,
        position: pos,
        roomType,
        price,
        status: 'Available',
        isOccupied: false,
        features,
        currentBooking: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  // Floor 10: 7 rooms (Suite tier)
  for (let pos = 1; pos <= 7; pos++) {
    rooms.push({
      _id: `room_10_${pos}`,
      roomNumber: 1000 + pos,
      floor: 10,
      position: pos,
      roomType: 'Suite',
      price: 450,
      status: 'Available',
      isOccupied: false,
      features: ['Wifi', 'Mini Bar', 'Ocean View', 'Quiet', 'Jacuzzi', 'Connected'],
      currentBooking: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

// Initialize default mock reviews
function initializeReviews() {
  if (reviews.length > 0) return;
  reviews = [
    {
      _id: 'rev_1',
      guestName: 'Lady Victoria',
      roomNumber: 1001,
      rating: 5,
      comment: 'Absolutely breathtaking! The quiet ocean view suite was divine.',
      sentiment: 'Positive',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'rev_2',
      guestName: 'John Sterling',
      roomNumber: 402,
      rating: 4,
      comment: 'Very professional staff and comfortable deluxe bedding.',
      sentiment: 'Positive',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'rev_3',
      guestName: 'David H.',
      roomNumber: 103,
      rating: 2,
      comment: 'Noisy elevators nearby. Maintenance took too long to respond.',
      sentiment: 'Negative',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];
}

// Run initializations
initializeUsers();
initializeRooms();
initializeReviews();

module.exports = {
  // Users Store
  getUsers: () => users,
  addUser: (userData) => {
    const newUser = {
      _id: `user_${Date.now()}`,
      role: 'Customer',
      loyalty_points: 10, // initial reward points
      membership_level: 'Bronze',
      preferences: { roomType: 'Any', features: [] },
      ...userData
    };
    users.push(newUser);
    return newUser;
  },

  // Rooms Store
  getRooms: () => {
    initializeRooms();
    return rooms.map(r => {
      const activeBookings = bookings.filter(b => b.status === 'active');
      const b = activeBookings.find(bk => bk.roomNumbers.includes(r.roomNumber));
      return {
        ...r,
        currentBooking: b ? { _id: b._id, bookingReference: b.bookingReference, guestName: b.guestName } : null
      };
    });
  },
  updateRoomStatus: (roomNumber, status) => {
    const r = rooms.find(rm => rm.roomNumber === Number(roomNumber));
    if (r) {
      r.status = status;
      r.isOccupied = status === 'Occupied';
      r.updatedAt = new Date();
      return r;
    }
    return null;
  },
  addCustomRoom: (roomData) => {
    const newRoom = {
      _id: `room_custom_${Date.now()}`,
      status: 'Available',
      isOccupied: false,
      features: roomData.features || ['Wifi'],
      currentBooking: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...roomData
    };
    rooms.push(newRoom);
    return newRoom;
  },
  deleteRoomByNumber: (num) => {
    const idx = rooms.findIndex(r => r.roomNumber === Number(num));
    if (idx !== -1) {
      rooms.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Bookings Store
  getBookings: () => {
    return bookings.filter(b => b.status === 'active').map(b => {
      const populatedRooms = rooms.filter(r => b.roomNumbers.includes(r.roomNumber));
      return { ...b, rooms: populatedRooms };
    });
  },
  getAllRawBookings: () => bookings,
  addBooking: (bookingData) => {
    const ref = 'HTL-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    const newBooking = {
      _id: `booking_${Date.now()}`,
      status: 'active',
      bookingReference: ref,
      paymentStatus: 'Pending',
      loyaltyPointsEarned: Math.round(bookingData.totalAmount * 0.1),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...bookingData
    };
    
    // Add points if user is logged in
    if (bookingData.user) {
      const u = users.find(usr => usr._id === bookingData.user || usr.email === bookingData.user);
      if (u) {
        u.loyalty_points += newBooking.loyaltyPointsEarned;
        // recalculate level
        if (u.loyalty_points >= 1000) u.membership_level = 'Platinum';
        else if (u.loyalty_points >= 500) u.membership_level = 'Gold';
        else if (u.loyalty_points >= 200) u.membership_level = 'Silver';
      }
    }

    bookings.unshift(newBooking);
    return newBooking;
  },
  cancelBooking: (id) => {
    const booking = bookings.find(b => b._id === id || b.bookingReference === id);
    if (booking) {
      booking.status = 'cancelled';
      booking.paymentStatus = 'Refunded';
      booking.updatedAt = new Date();
      // Free rooms
      rooms.forEach(r => {
        if (booking.roomNumbers.includes(r.roomNumber)) {
          r.isOccupied = false;
          r.status = 'Available';
          r.currentBooking = null;
        }
      });
      return true;
    }
    return false;
  },
  setRandomOccupancy: () => {
    initializeRooms();
    bookings.forEach(b => { b.status = 'cancelled'; });
    rooms.forEach(r => {
      r.isOccupied = false;
      r.status = 'Available';
      r.currentBooking = null;
    });

    const count = Math.floor(Math.random() * 50) + 20; // 20-69 rooms
    const shuffled = [...rooms].sort(() => Math.random() - 0.5).slice(0, count);
    shuffled.forEach(r => {
      r.isOccupied = true;
      r.status = 'Occupied';
    });
    return count;
  },
  resetAll: () => {
    bookings.forEach(b => { b.status = 'cancelled'; });
    payments = [];
    reviews = [];
    initializeReviews();
    rooms.forEach(r => {
      r.isOccupied = false;
      r.status = 'Available';
      r.currentBooking = null;
    });
  },

  // Payments Store
  getPayments: () => payments,
  addPayment: (paymentData) => {
    const ref = 'TXN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    const newPayment = {
      _id: `pay_${Date.now()}`,
      paymentStatus: 'Completed',
      transactionReference: ref,
      createdAt: new Date(),
      ...paymentData
    };
    payments.push(newPayment);
    
    // Update booking payment status
    const b = bookings.find(bk => bk._id === paymentData.booking || bk.bookingReference === paymentData.booking);
    if (b) {
      b.paymentStatus = 'Paid';
    }
    return newPayment;
  },

  // Reviews Store
  getReviews: () => reviews,
  addReview: (reviewData) => {
    // Basic sentiment extraction (Positive, Neutral, Negative)
    const text = (reviewData.comment || '').toLowerCase();
    let sentiment = 'Neutral';
    if (text.includes('great') || text.includes('excellent') || text.includes('beautiful') || text.includes('breathtaking') || text.includes('perfect') || text.includes('good') || text.includes('divine')) {
      sentiment = 'Positive';
    } else if (text.includes('bad') || text.includes('poor') || text.includes('noisy') || text.includes('dirty') || text.includes('maintenance') || text.includes('disappointed')) {
      sentiment = 'Negative';
    }

    const newReview = {
      _id: `rev_${Date.now()}`,
      sentiment,
      createdAt: new Date(),
      ...reviewData
    };
    reviews.unshift(newReview);
    return newReview;
  }
};

const express = require('express');
const router = express.Router();
const { 
  bookRooms, 
  getAllBookings, 
  cancelBooking, 
  createPayment, 
  getAllPayments, 
  createReview, 
  getAllReviews, 
  getAnalytics 
} = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.post('/', bookRooms);
router.delete('/:id', cancelBooking);

router.post('/pay', createPayment);
router.get('/payments', getAllPayments);

router.post('/reviews', createReview);
router.get('/reviews', getAllReviews);

router.get('/analytics', getAnalytics);

module.exports = router;

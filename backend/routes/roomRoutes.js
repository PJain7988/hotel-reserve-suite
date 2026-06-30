const express = require('express');
const router = express.Router();
const { getAllRooms, randomOccupancy, resetAll, createRoom, updateRoom, deleteRoom } = require('../controllers/bookingController');

router.get('/', getAllRooms);
router.post('/random', randomOccupancy);
router.post('/reset', resetAll);

router.post('/', createRoom);
router.put('/:roomNumber', updateRoom);
router.delete('/:roomNumber', deleteRoom);

module.exports = router;

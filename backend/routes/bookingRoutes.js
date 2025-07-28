const express = require("express");
const router = express.Router();
const bookingController  = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");
const geofenceMiddleware = require("../middlewares/geofenceMiddleware");

router.post('/book', authMiddleware, bookingController.book); 
router.delete('/cancel', authMiddleware, bookingController.cancelBooking); 
router.get('/getall', authMiddleware, bookingController.getAllBookings); 
router.put('/validate', authMiddleware, geofenceMiddleware, bookingController.validateBooking); 

module.exports = router;

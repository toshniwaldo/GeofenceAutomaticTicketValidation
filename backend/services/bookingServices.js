const bookingModel = require("../models/bookingModel"); 

const book = async (req) => {
  const { userId, eventId } = req.body;  

  const status = "booked";
  const time = Date.now();  

  const createNewBooking = await bookingModel.create({
    userId,
    eventId,
    bookedAt : time,
    status
  });  
  if (!createNewBooking) {
    throw new Error("Unable to book ticket");
  }

  return createNewBooking;
};

const cancelBooking = async (req) => {
  const {bookingId} = req.body;

  const cancellingBooking = await bookingModel.findByIdAndDelete(bookingId);

  if (!cancellingBooking) {
    throw new Error("Unable to cancel current booking");
  }

  return cancellingBooking;
};

const getAllBookings = async (req) => {
  const {userId} = req.body;

  const gettingAllBookings = await bookingModel.find({ userId });

  if (!gettingAllBookings) {
    throw new Error("Unable to fetch bookings"); 
  }

  return gettingAllBookings;
};


//geofence middleware check geofecne logic(is user inside geofence) before this function runs 
const validateBooking = async (req) => {
  const {bookingId} = req.body;
  const booking = await bookingModel.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  //Replay attack protection
  if (booking.status !== "booked") {
    throw new Error(`Invalid booking status: ${booking.status}. Cannot validate.`);  // fixed: added status check
  }

  // Geofence check already handled by middleware before this runs 
  booking.status = "validated";
  await booking.save();

  return { message: "Booking successfully validated", booking };
};

module.exports = {
  book,
  cancelBooking,
  getAllBookings,
  validateBooking
};

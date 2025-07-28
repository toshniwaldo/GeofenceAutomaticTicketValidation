const bookingServices = require("../services/bookingServices");

const book = async (req, res) => {
  try {
    const result = await bookingServices.book(req);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const result = await bookingServices.cancelBooking(req);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validateBooking = async (req, res) => {
  try {
    const result = await bookingServices.validateBooking(req);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const result = await bookingServices.getAllBookings(req);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  book,
  cancelBooking,
  validateBooking,
  getAllBookings
};

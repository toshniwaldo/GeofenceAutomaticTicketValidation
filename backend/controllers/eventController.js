const eventServices = require("../services/eventServices");

const createEvent = async (req, res) => {
  try {
    const result = await eventServices.createEvent(req);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const result = await eventServices.updateEvent(req);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const result = await eventServices.deleteEvent(req);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const result = await eventServices.getAllEvents(req.body);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvents
};

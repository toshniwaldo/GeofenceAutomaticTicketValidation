const eventModel = require("../models/eventModel"); 

const createEvent = async (req) => {
  const name = req.body.name;
  const time = req.body.time;
  const area = req.body.area;
  const location = req.body.location;
  const radius = req.body.radius;
  const price = req.body.price;
  const date = req.body.date;
  
  const overlappingEvent = await eventModel.findOne({ date, time });
  if (overlappingEvent) {
    throw new Error("Event already present at this time! pick different time or date");
  }

  const newEvent = await eventModel.create({
    name,
    time,
    area,
    location,
    radius,
    price,
    date
  });

  return { newEvent };
};

const updateEvent = async (req) => {
  const {eventId ,updatedData}= req.body

  const updatedEvent = await eventModel.findByIdAndUpdate(
    eventId,
    updatedData,
    { new: true }
  );

  if (!updatedEvent) {
    throw new Error("Event not found to update");
  }

  return updatedEvent;
};

const deleteEvent = async (req) => {
  const {eventId} = req.body;

  const deletedEvent = await eventModel.findByIdAndDelete(eventId);

  if (!deletedEvent) {
    throw new Error("Event not found to delete");
  }

  return deletedEvent;
};

const getAllEvents = async (req) => {
  const events = await eventModel.find({});
  return events;
};

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvents
};

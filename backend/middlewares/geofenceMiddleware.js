const eventModel = require("../models/eventModel");

const toRadians = (degrees) => (degrees * Math.PI) / 180;  // function to convert deg to rad

const geofenceMiddleware = async (req, res, next) => {
  const { eventId, latitude, longitude } = req.body;  

  if (!eventId || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing eventId or user location in request body" });  // fixed: added combined body validation
  }

  const event = await eventModel.findById(eventId);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const [eventLon, eventLat] = event.location.coordinates;
  const radius = event.radius;  // in kilometers

  // 🌍 Haversine distance calculation
  const dLat = toRadians(latitude - eventLat);
  const dLon = toRadians(longitude - eventLon);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(eventLat)) *
    Math.cos(toRadians(latitude)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = 6371 * c;  // Earth radius in km

  if (distance > radius) {
    return res.status(403).json({ error: "User is outside the event geofence" });
  }

  next();  
};

module.exports = geofenceMiddleware;

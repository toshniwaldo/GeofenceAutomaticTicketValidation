const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/create", authMiddleware,adminMiddleware, eventController.createEvent);
router.get("/all", authMiddleware, eventController.getAllEvents);
router.put("/update", authMiddleware,adminMiddleware, eventController.updateEvent);
router.delete("/delete", authMiddleware, adminMiddleware, eventController.deleteEvent);

module.exports = router;


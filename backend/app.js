const express = require("express");
const connectDB = require('./config/db');
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); //connecting to datebase 

//routing 
app.use('/auth',authRoutes);
app.use('/events',eventRoutes);
app.use('/bookings',bookingRoutes);

//starting the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


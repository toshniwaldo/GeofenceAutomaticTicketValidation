const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },              
  area: { type: String, required: true },
  radius: { type: Number, required: true },
  price: { type: Number, required: true },
  location: {
    type: {
      type: String,
      default: "Point",                                 
      enum: ["Point"],                                  //It restricts the value of type to only one valid option: 'Point'.
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

eventSchema.index({ location: "2dsphere" }); //lets mongoose know that location is spacial thing and give functions on top of it 

const eventModel = mongoose.model("Event", eventSchema); 
module.exports = eventModel;

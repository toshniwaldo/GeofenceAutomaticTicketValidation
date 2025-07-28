const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User" ,//it points to another document in a different collection
        required : true

    },
    eventId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event",//it points to another document in a different collection
        required : true
    },
    bookedAt : { 
        type : Date,
        default : Date.now
        ,
        required : true
    }, 
    status : {
        type : String,
        enum : ['booked','validated','cancelled'],
        required : true
    }
})

const bookingModel = mongoose.model("booking",bookingSchema);
module.exports = bookingModel;
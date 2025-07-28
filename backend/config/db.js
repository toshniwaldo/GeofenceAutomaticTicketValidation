const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected Succesfully");
    }catch{
        console.log("DB Connection Failed");
        process.exit(1);
    }
}
module.exports = connectDB;
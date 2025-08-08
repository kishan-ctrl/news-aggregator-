const mongoose = require("mongoose");
const dotenv= require("dotenv");

dotenv.config();

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB is connected successfully")
    }catch(error){
        console.log("failed to connect mongoDB",error.massage);
        process.exit(1);

    }

};

module.exports=connectDB;

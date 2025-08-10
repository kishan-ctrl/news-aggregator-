const mongoose = require ("mongoose");

const connectDB = async()=>{
    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is connected");
    }catch(err){

        console.err("DataBase Connection is failed",err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

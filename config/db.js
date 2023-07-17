const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection established");
  } catch (error) {
    console.log(`Error connecting to database: ${error.message}`.bgRed.white);
  }
};

module.exports = connectDB;

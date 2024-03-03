const URL = process.env.MONGO_URL;

const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose.connect(URL);
    console.log("connection successful to DB");
  } catch (error) {
    console.error("database Connection failed", error);
    process.exit(0);
  }
};
module.exports = connectDb;

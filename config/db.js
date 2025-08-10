const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    const db = await mongoose.connect(uri);
    console.log(`Database connected: ${db.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

// Reads files from default.json and attempts to connect to the database

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.db_uri, //URI is stored in .env, this reads it and passes the string
    {useNewUrlParser:true, useUnifiedTopology: true}); //Uses a non-deprecated URL parser and other thing
    console.log(`MongoDB is Connected, it\'s grooving time`);
  } catch (err) {
    console.error('MongoDB is not connected:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

/**
 * 
 * The database.js file connects to a local MongoDB database.js
 * Ideally, we would connect to a remote host using a connection string 
 * stored as an environment variable
 * 
 */

const mongoose = require('mongoose'); // Import mongoose library

// Environment variable for database string format below
// mongoose.connect(process.env.DATABASE_URL);
mongoose.connect('mongodb://localhost:27017/Vehicle');

// shortcut to mongoose.connection object
const db = mongoose.connection;

// message alert for successful connection
db.on('connected', function () {
  console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});
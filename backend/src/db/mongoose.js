const mongoose = require('mongoose');
require('dotenv').config();
const database = process.env.DATABASE 
// Create a connection to your MongoDB database
mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
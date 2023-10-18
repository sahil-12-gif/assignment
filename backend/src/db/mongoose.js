const mongoose = require('mongoose');

// Create a connection to your MongoDB database
mongoose.connect('mongodb://localhost:27017/cv', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
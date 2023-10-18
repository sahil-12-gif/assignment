const mongoose = require('mongoose');

// Define the Following schema to track user following relationships
const followingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who is following
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user being followed
  },
});

const Following = mongoose.model('Following', followingSchema);

module.exports = Following;

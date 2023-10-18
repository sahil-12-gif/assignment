const mongoose = require('mongoose');

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  techstack: [
    {
      type: String,
    },
  ],
  bio: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your User model
    required: true,
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

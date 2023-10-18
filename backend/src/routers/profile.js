const express = require('express');
const auth = require("../middleware/auth");
const Profile = require('../models/profile');
const User = require('../models/user');
const router = express.Router();

// Creating the new user profile of the authenticated user
router.post('/user/profile', auth, async (req, res) => {
    const { name, techstack, bio } = req.body;
    try {
        // Get the authenticated user's ID from the request
        const userId = req.user._id;

        // Create a new profile document and save it to the database
        const newProfile = new Profile({ name, techstack, bio, userId });
        await newProfile.save();

        res.status(201).json(newProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// http://localhost:3000/user/search-profiles?techstack=Node.js&keyword=web get request
// Search Profiles Route
router.get('/user/search-profiles', async (req, res) => {
    const { techstack, keyword } = req.query;

    try {
        let filter = {};
        if (techstack) {
            filter.techstack = techstack; // Filter by techstack if provided
        }
        if (keyword) {
            // Use a regular expression to perform a case-insensitive keyword search
            const keywordRegex = new RegExp(keyword, 'i');
            filter.$or = [{ name: keywordRegex }, { bio: keywordRegex }];
        }
        // Find profiles matching the search criteria
        const profiles = await Profile.find(filter).exec();
        res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Get user profile by user ID
router.get('/user/profile/:userId', async (req, res) => {
    try {
        // Get the user ID from the request parameters
        const userId = req.params.userId;

        // Find the user by their ID
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the user's profile using their ID
        const userProfile = await Profile.findOne({ userId }).exec();

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Create a new object without the userId field
        const sanitizedProfile = { ...userProfile.toObject() };
        delete sanitizedProfile.userId;

        // Return the user's profile without the userId field
        res.status(200).json(sanitizedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to get the user's profile by their ID
router.get('/user/me', auth, async (req, res) => {
    try {
        // Get the authenticated user's ID from the request (provided by the auth middleware)
        const userId = req.user._id;

        // Find the user's profile using their ID
        const userProfile = await Profile.findOne({ userId }).exec();

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Create a new object without the userId field
        const sanitizedProfile = { ...userProfile.toObject() };
        delete sanitizedProfile.userId;

        // Return the user's profile without the userId field
        res.status(200).json(sanitizedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
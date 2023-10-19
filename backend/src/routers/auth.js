const express = require('express');
const User = require('../models/user');
const Profile = require('../models/profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const auth = require('../middleware/auth'); // Import the auth middleware
const router = express.Router();

// User Registration
router.post('/user/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.exists({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // const newUser = new User({ username, email, password: hashedPassword });
        // await newUser.save();

        // Create a new dummy profile with empty fields
        const newProfile = new Profile({
            // Link the profile to the newly created user
            name: '',        // You can set these fields as empty or with default values
            techstack: [],
            bio: '',
            education: '',
            experience: '',
            languages: [],
        });
        await newProfile.save();
        const newUser = new User({ username, email, password: hashedPassword, profile: newProfile._id });
        newUser.profile.userId = newUser._id; // Set the userId in the newProfile
        await newUser.save();
        // Generate an authentication token with the user's ID upon successful registration
        const token = jwt.sign({ _id: newUser._id.toString() }, 'love-babbar');
        res.header('Authorization', `Bearer ${token}`);

        // Exclude the password from the response
        const responseUser = { ...newUser.toObject() };
        delete responseUser.password;

        res.status(201).json({ newUser: responseUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Logged in User
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, 'love-babbar'); // Replace with your own secret key

        // Set the token in the response headers
        res.header('Authorization', `Bearer ${token}`);
        res.status(200).json({ user, token }); // Include the token in the response
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
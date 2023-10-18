const express = require('express');
const User = require('../models/user');
const Profile = require('../models/profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Import the auth middleware
const router = express.Router();


// List all users which are in my database
// auth - authentication is not needed in this route
router.get('/user/all', async (req, res) => {
    try {
        // Query your user database to retrieve all users
        const allUsers = await User.find().exec();

        if (allUsers.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // You might want to omit sensitive information like passwords
        const sanitizedUsers = allUsers.map((user) => {
            const { _id, username, email } = user;
            return { _id, username, email };
        });

        res.status(200).json(sanitizedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});




module.exports = router;

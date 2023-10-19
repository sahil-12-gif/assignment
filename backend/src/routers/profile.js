const express = require('express');
const auth = require("../middleware/auth");
const Profile = require('../models/profile');
const User = require('../models/user');
const router = express.Router();

// Creating or updating the user profile of the authenticated user
router.post('/user/profile', auth, async (req, res) => {
    const { name, techstack, bio, education, experience, languages } = req.body;
    try {
        // Get the authenticated user's ID from the request
        const userId = req.user._id;

        // Check if the user already has a profile
        let existingProfile = await Profile.findOne({ userId });

        if (existingProfile) {
            // If a profile already exists, update it
            existingProfile.name = name;
            existingProfile.techstack = techstack;
            existingProfile.bio = bio;
            existingProfile.education = education;
            existingProfile.experience = experience;
            existingProfile.languages = languages;
            await existingProfile.save();
            res.status(200).json(existingProfile);
        } else {
            // If no profile exists, create a new one
            const newProfile = new Profile({ name, techstack, bio, education, experience, languages, userId });
            await newProfile.save();
            res.status(201).json(newProfile);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// http://localhost:3000/user/search-profiles?techstack=Node.js&keyword=web get request
// Search Profiles Route
// router.get('/user/search-profiles', async (req, res) => {
//     const { techstack, keyword } = req.query;

//     try {
//         let filter = {};
//         if (techstack) {
//             filter.techstack = techstack; // Filter by techstack if provided
//         }
//         if (keyword) {
//             // Use a regular expression to perform a case-insensitive keyword search
//             const keywordRegex = new RegExp(keyword, 'i');
//             filter.$or = [{ name: keywordRegex }, { bio: keywordRegex }];
//         }
//         // Find profiles matching the search criteria
//         const profiles = await Profile.find(filter).exec();
//         res.status(200).json(profiles);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });


// Get user profile by user ID
router.get('/user/profile/:userId', async (req, res) => {
    try {
        // Get the user ID from the request parameters
        const userId = req.params.userId;
        console.log(userId, ' userID');
        // const ProfileId = req.user.profile;
        // console.log(ProfileId,' ProfileId')
        // Find the user's profile using their ID
        // const userProfile = await Profile.findOne(ProfileId).exec();
        // Find the user by their ID
        const user = await User.findById(userId).exec();
        console.log(user, ' user')
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the user's profile using their ID
        const userProfile = await Profile.findOne(user.profile).exec();

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
        const ProfileId = req.user.profile;
        // console.log(ProfileId,' ProfileId')
        // Find the user's profile using their ID
        const userProfile = await Profile.findOne(ProfileId).exec();
        console.log(userProfile)
        if (!userProfile) {
            // cos
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

// Update the user's profile by the authenticated user
router.post('/update-profile/me', auth, async (req, res) => {
    const { name, techstack, bio, education, experience, languages } = req.body;
    console.log(req.body,' REQ.BODY')
    const ProfileId = req.user.profile;
    // console.log(ProfileId, ' ProfileId')// Get the authenticated user's ID

    try {
        // Find the user's profile using their user ID
        const userProfile = await Profile.findOne(ProfileId);

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        let resultArray=techstack;
        let language=languages;
        if(!Array.isArray(techstack)){
            console.log(' came inside this part')
         resultArray = techstack.split(',').map(item => item.toLowerCase());
        console.log(resultArray,' resultArray')
        }
        if(!Array.isArray(languages)){
         language = languages.split(',').map(item => item.toLowerCase());
        }
        userProfile.name = name;
        userProfile.techstack = resultArray;
        userProfile.bio = bio;
        userProfile.education = education;
        userProfile.experience = experience;
        userProfile.languages = language;

        // Save the updated profile
        await userProfile.save();

        // Return the updated profile
        res.status(200).json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get profiles with pagination
// Route to filter users based on techStack and language
router.get('/user/filter', async (req, res) => {
    try {
        const { techStack, language } = req.query;
        const allUsers = await User.find({}).populate('profile').exec();
        if (!techStack && !language) {
            return res.status(200).json(allUsers);
        }
console.log(allUsers,' all users')
        // Otherwise, filter the users based on tech stack and/or language
        const filteredUsers = allUsers.filter(user => {
            const hasTechStack = techStack ? user.profile.techstack.includes(techStack) : true;
            const hasLanguage = language ? user.profile.languages.includes(language) : true;
            console.log(hasTechStack)
            console.log(hasLanguage)
            return hasTechStack && hasLanguage;
        });
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});




module.exports = router;
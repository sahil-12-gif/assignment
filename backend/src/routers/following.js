const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const Following = require('../models/following');
const User = require('../models/user');
// Follow a Profile Route
// http://localhost:3000/user/follow/652f8170c07345b75735a330
router.post('/user/follow/:userId', auth, async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user._id;

    try {
        // Check if the user is already following the target user
        const existingFollow = await Following.findOne({ userId: followerId, followingId: userId });

        if (existingFollow) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        // Create a new follow relationship
        const newFollow = new Following({ userId: followerId, followingId: userId });
        await newFollow.save();

        res.status(201).json({ message: 'You are now following this user' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
//   /user/unfollow/:userId
// Unfollow a Profile Route
router.post('/user/unfollow/:userId', auth, async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user._id;

    try {
        // Find and de lete the follow relationship
        const deleteResult = await Following.findOneAndDelete({
            userId: followerId,
            followingId: userId,
        }).exec();

        if (!deleteResult) {
            return res.status(400).json({ message: "You aren't following this user" });
        }

        res.status(200).json({ message: 'You have unfollowed this user' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get Users Followed by a User Route
router.get('/user/following/to', auth, async (req, res) => {
    console.log(req.user, ' req')
    const userId = req.user._id;
    console.log(userId)
    try {
        // Find all follow relationships where the user is the follower (followerId)
        const followingUsers = await Following.find({ userId: userId });
        console.log(followingUsers, ' followingUsers')

        if (followingUsers.length === 0) {
            return res.status(404).json({ message: 'This user is not following anyone' });
        }

        // Extract the IDs of users being followed
        const followingIds = followingUsers.map((follow) => follow.followingId);
        console.log(followingIds)

        // Query your user database to get the details of following users
        const followingProfiles = await User.find({ _id: { $in: followingIds } });
        console.log(followingProfiles, ' followingProfiles')

        res.status(200).json(followingProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
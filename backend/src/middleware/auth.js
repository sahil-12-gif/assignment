const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const secret = process.env.SECRETKEY 
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, secret); // Replace with your own secret key

    const user = await User.findOne({ _id: decoded._id });
    // console.log(user, ' In the auth')
    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = auth;

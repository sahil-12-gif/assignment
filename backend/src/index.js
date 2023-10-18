const express = require('express')
require('dotenv').config();
require('./db/mongoose')
// require('dotenv').config();

const userRouter = require('./routers/user')
const profileRouter = require('./routers/profile')
const followingRouter = require('./routers/following')
const authRouter = require('./routers/auth')
const User = require('./models/user')
const Profile = require('./models/profile')
const app = express()
const port = process.env.PORT 
const cors = require('cors');

// Allow cross-origin requests from all domains (for development, you can restrict this in production)
app.use(cors());

app.use(express.json())
app.use(userRouter)
app.use(profileRouter)
app.use(followingRouter)
app.use(authRouter)
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
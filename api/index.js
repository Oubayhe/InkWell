// for .env variables
require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')

// Routes
const userRoutes = require('./routes/user.route')
const authRoutes = require('./routes/auth.route')

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Server is running...')
        })
    })
    .catch((err) => {
        console.log(err)
    })

const app = express()

// Middlewares
// We can use this below as alternative of morgan('dev') middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
// For JSON
app.use(express.json())

// routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


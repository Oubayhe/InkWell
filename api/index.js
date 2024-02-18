// for .env variables
require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')

// Routes
const userRoutes = require('./routes/user.route')
const authRoutes = require('./routes/auth.route')

const app = express()

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Server is running...')
        })
    })
    .catch((err) => {
        console.log(err)
    })


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

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


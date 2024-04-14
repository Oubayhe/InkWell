// for .env variables
require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')

const cookieParser = require('cookie-parser')

// Routes
const userRoutes = require('./routes/user.route')
const authRoutes = require('./routes/auth.route')
const postRoutes = require('./routes/post.route')
const commentRoutes = require('./routes/comment.route')

const path = require('path')

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

// const __dirname = path.resolve()

// Middlewares
// We can use this below as alternative of morgan('dev') middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Made the Database accessable from anywhere
// For JSON
app.use(express.json())
// for identify the token
app.use(cookieParser())

// routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)

app.use(express.static(path.join( __dirname, '/client/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join( __dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


// for .env variables
require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Server is running...')
        })
    })

const app = express()


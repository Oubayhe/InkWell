// for .env variables
require('dotenv').config()
const jwt = require('jsonwebtoken')
const errorHandler = require('./error')


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return next(errorHandler(401, "You have been logged out by the server. You need to sign in again."))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return next(errorHandler(401, 'You have been logged out by the server. You need to sign in again.'))
        }
        req.user = user
        next()
    })
}

module.exports = verifyToken
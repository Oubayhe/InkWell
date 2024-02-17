// for .env variables
require('dotenv').config()

const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const errorHandler = require('../utils/error')
const jwt = require('jsonwebtoken')


const signup = async (req, res, next) => {
    const { username, email, password } = req.body
    const hashedPassword = bcryptjs.hashSync(password, 10)

    if (!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, 'All fields are required'))
    }

    try {
        const newuser = new User({username, email, password: hashedPassword})
        await newuser.save()
        return res.status(200).json({ message: 'User was added succefuly' })
    } catch (error) {
        next(error)
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body
    
    if (!email || !password || email === '' || password === '' ) {
        next(errorHandler(400, 'All fields are required')) 
    }

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(404, 'User not found'))
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const {password: _pass, ...rest} = validUser._doc
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)

    } catch (error) {
        next(error)
    }
}

module.exports = { signup, signin }
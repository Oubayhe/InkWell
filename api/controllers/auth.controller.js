// for .env variables
require('dotenv').config()

const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const errorHandler = require('../utils/error')
const jwt = require('jsonwebtoken')
const validator = require('validator')


const signup = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, 'All fields are required'))
    }

    // Email
    if (!validator.isEmail(email)) {
        next(errorHandler(400, 'Wrong email format'))
    }
    // Password
    if(!validator.isStrongPassword(password)) {
        next(errorHandler(400, 'Password must be at least 8 characters long and contain a mix of uppercase and lowercase letters, numbers, and special characters.'))
    }
    
    if (validator.isEmail(email) && validator.isStrongPassword(password)) {
        try {
        
            const hashedPassword = bcryptjs.hashSync(password, 10)
            const newuser = new User({username, email, password: hashedPassword})
            await newuser.save()
            return res.status(200).json({ message: 'User was added succefuly' })
        } catch (error) {
            if (error.code === 11000) {
                // MongoDB duplicate key error
                return next(errorHandler(400, 'Username or email is already in use'))
            }
            next(error)
        }
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
        const token = jwt.sign({ id: validUser._id, username: validUser.username }, process.env.JWT_SECRET)
        const {password: _pass, ...rest} = validUser._doc
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)

    } catch (error) {
        next(error)
    }
}

const google = async (req, res, next) => {
    const { username, email, googlePhotoUrl } = req.body
    try {
        const user = await User.findOne({email})
        if(user){
            const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET)
            const { password, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest)
        } else {
            const generatedPassword = Math.random.toString(36).slice(-8) + Math.random.toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: username.toLowerCase().split(' ').join('_') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password, ...rest } = newUser._doc
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { signup, signin, google }
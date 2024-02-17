const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const errorHandler = require('../utils/error')


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

module.exports = {
    signup,
}
const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')


const signup = async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = bcryptjs.hashSync(password, 10)

    if (!username || !email || !password || username === '' || email === '' || password === ''){
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const newuser = new User({username, email, password: hashedPassword})
        await newuser.save()
        return res.status(200).json({ message: 'User was added succefuly' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    signup,
}
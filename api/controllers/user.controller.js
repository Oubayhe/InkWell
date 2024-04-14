const errorHandler = require("../utils/error")
const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')
const { countDocuments } = require("../models/post.model")

const test = (req, res) => {
    res.json({ msg: 'api is working using Controllers' })
}

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this error'))
    }
    if(req.body.password) {
        if(req.body.password.length < 6){
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        // We can use the validator package to check if the Password is correct without the checking its length
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    
    if (req.body.username) {
        if(req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        }, {new: true})
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    if ( !req.query.allowed && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out')
    } catch (error) {
        next(error)
    }
}

// const getUsers = async (req, res, next) => {
//     try {
//         const startIndex = parseInt(req.query.startIndex) || 0
//         const limit = parseInt(req.query.limit) || 9
//         const sortDirection = req.query.sort === 'asc' ? 1 : -1

//         const users = await User.find()
//             .sort({ createdAt: sortDirection })
//             .skip(startIndex)
//             .limit(limit)
        
//         const usersWithoutPassword = users.map((user) => {
//             const { password, ...rest } = user._doc
//             return rest
//         })

//         const totalUsers = await User.countDocuments()
//         const now = new Date()
//         const oneMonthAgo = new Date(
//             now.getFullYear(),
//             now.getMonth() - 1,
//             now.getDate()
//         )
//         const lastMonthUsers = await User.countDocuments({
//             createdAt: { $gte: oneMonthAgo }
//         })
//         res.status(200).json ({
//             users: usersWithoutPassword,
//             totalUsers,
//             lastMonthUsers,
//         })
//     } catch (error) {
//         next(error)
//     }
// }

const getUsers = async (req, res, next) => {
    try {

        const users = await User.find()
        
        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })
        res.status(200).json ({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        })
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return next(errorHandler(404, 'User not found'))
        }
        const { password, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    test,
    updateUser,
    deleteUser,
    signout,
    getUsers,
    getUser,
}
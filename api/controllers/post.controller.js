const errorHandler = require('../utils/error')
const Post = require('../models/post.model')


const createPost = async (req, res, next) => {
    // for us there is no need of checking if the user is Admin or not, because all our users can create a post
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'))
    }
    const unique = new Date().getTime() + '_' + req.user.username 
    const slug = req.body.title.split(' ').join('_').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '') + unique 
    console.log(req.user)
    const { username, ...rest} = req.body
    const newPost = new Post({
        ...rest,
        slug, 
        userId: req.user.id,
    })
    try {
        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createPost,
}
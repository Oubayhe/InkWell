const errorHandler = require('../utils/error')
const Post = require('../models/post.model')


const createPost = async (req, res, next) => {
    // for us there is no need of checking if the user is Admin or not, because all our users can create a post
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'))
    }

    // Set default images if images array is not provided in the request
    if (req.body.images.length == 0) {
        req.body.images = [{
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvOhjemRGwgin-OfscF_9897HTfaTECNz3CA&usqp=CAU',
            caption: 'default-image'
        }];
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

const getPost = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = ((req.query.order === 'asc') ? 1 : -1)
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && { 
                $or: [
                    { title: {$regex: req.query.searchTerm, $options: 'i' }},
                    { content: {$regex: req.query.searchTerm, $options: 'i' }},
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit)

        const totalPosts = await Post.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })
        res.status(200).json({
            posts, 
            totalPosts,
            lastMonthPosts,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createPost,
    getPost,
}
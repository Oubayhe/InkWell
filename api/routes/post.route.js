const express = require('express')
const verifyToken = require('../utils/verifyUser')
const postController = require('../controllers/post.controller')

const router = express.Router()

router.post('/create', verifyToken, postController.createPost)
// We're not using verifyToken because we want everybody to be able to see the posts
router.get('/getposts',  postController.getPost)
router.delete('/deletepost/:postId/:userId', verifyToken, postController.deletePost)
router.put('/updatepost/:postId/:userId', verifyToken, postController.updatePost)

module.exports = router
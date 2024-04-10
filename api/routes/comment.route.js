const express = require('express')
const commentController = require('../controllers/comment.controller')
const verifyToken = require('../utils/verifyUser')

const router = express.Router()

router.post('/create', verifyToken, commentController.createComment)
router.get('/getPostComments/:postId', commentController.getPostComments)
router.put('/likeComment/:commentId', verifyToken, commentController.likeComment)

module.exports = router
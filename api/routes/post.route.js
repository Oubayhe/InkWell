const express = require('express')
const verifyToken = require('../utils/verifyUser')
const postController = require('../controllers/post.controller')

const router = express.Router()

router.post('/create', verifyToken, postController.createPost)

module.exports = router
const express = require('express')
const userControllers = require('../controllers/user.controller')
const verifyToken = require('../utils/verifyUser')

const router = express.Router()

router.get('/test', userControllers.test)
router.put('/update/:userId', verifyToken, userControllers.updateUser)

module.exports = router
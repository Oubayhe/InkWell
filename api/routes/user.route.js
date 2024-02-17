const express = require('express')
const userControllers = require('../controllers/user.controller')

const router = express.Router()

router.get('/test', userControllers.test)

module.exports = router
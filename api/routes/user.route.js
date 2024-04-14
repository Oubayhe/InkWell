const express = require('express')
const userControllers = require('../controllers/user.controller')
const verifyToken = require('../utils/verifyUser')

const router = express.Router()

router.get('/test', userControllers.test)
router.put('/update/:userId', verifyToken, userControllers.updateUser)
router.delete('/delete/:userId', verifyToken, userControllers.deleteUser)
router.post('/signout', userControllers.signout)
router.get('/getusers', userControllers.getUsers)
router.get('/getuser/:userId', userControllers.getUser)

module.exports = router
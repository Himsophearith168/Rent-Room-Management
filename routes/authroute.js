const express = require('express')
const router = express.Router()
const user = require('../controller/user')
const auth = require('../middlewares/auth')

router.post('/register', user.register)
router.post('/login', user.login)
router.post('/forget-password', user.forgetPassword)
router.post('/reset-password', user.resetPassword)
router.post('/logout', auth.isLogin, user.logout)

module.exports = router;
const express = require('express');
const router = express.Router();
const {validateUser} = require('../middlewares');
const {registerUser, loginUser, logoutUser } = require('../controllers/auth')

router.route('/register')
    .post(validateUser, registerUser)

router.route('/login')
    .post(validateUser, loginUser)

router.route('/logout')
    .get(logoutUser)

module.exports = router;
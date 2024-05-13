const express = require('express');
const { validateUser, requireAuth } = require('../middlewares');
const User = require('../models/user');
const Cart = require('../models/cart')
const router = express.Router();

router.route('/cart')
    .post(requireAuth, async (req, res, next) => {
        const { user: {email} } = req;
        const user = await User.find({ email }).lean().exec()
        if (!user.cart) {
            const cart = await Cart.create({ cartOwner: user._id })
            user.cart = cart;
        } else {
            next(new AppError('You must be logged in', 402))
        }
    })
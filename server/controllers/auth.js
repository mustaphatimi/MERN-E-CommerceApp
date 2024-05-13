const User = require('../models/user');
const AppError = require('../utilities/AppError');
const { createToken } = require('../utilities/createToken');

const registerUser = async (req, res, next) => {
    try {
         const user = await User.register(req.body)
        if (user) {
            const token = await createToken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 1000 * 60 * 60,
                expires: 1000 * 60 * 60 * 24
            })
            req.headers = {
                authorization: `Bearer ${token}`
            }
            return res.status(201).json({message: 'User registration successful...', user, token})
        }   
        throw new AppError('User registration failed', 401)
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
        try {
        const user = await User.login(req.body)
            if (user) {
                const token = await createToken(user._id)
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 1000 * 60 * 60,
                    expires: 1000 * 60 * 60 * 24
                })
                req.headers = {
                authorization: `Bearer ${token}`
            }
                return res.status(201).json({message: `${user.email} logged in...`, user, token})
            }
            throw new AppError('Invalid login credentials', 401)
        } catch (error) {
            next(error)
        }
        
}

const logoutUser = (req, res, next) => {
        res.clearCookie('token')
        return res.status(200).json({message: 'Successfully logged out!'})
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}
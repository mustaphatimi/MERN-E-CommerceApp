const User = require('./models/user');
const {userSchema} = require('./schemas');
const AppError = require('./utilities/AppError');
const jwt = require('jsonwebtoken')
const {jwtDecode} = require('jwt-decode')

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
       next(new AppError('Please validate all credentials!!!', 401))
    }
    next();
}

const requireAuth = async (req, res, next) => {
    try {
        const { authorization } = req?.headers;
        const token = authorization.split(' ')[1];
        if (token) {
            const decodedToken = jwtDecode(token);
            if (new Date(decodedToken.exp * 1000) > new Date()) {
                const {_id} = jwt.verify(token, process.env.SECRET_KEY)
                if (_id) {
                    const user = await User.findOne({ _id });
                    if (user)
                        req.user = user
                        return next()
                }
                    throw new AppError('Authentication failed..', 400)
                }
            throw new AppError('Session Timeout', 402)
            }
        throw new AppError('You must be logged in', 401)
    } catch (error) {
        next(error)
    }
}

const isUser = (req, res, next) => {
    requireAuth(req, res, () => {
        try {
            if (req.user._id === req.params.id || req.user.isAdmin) {
                return next()
            }
            throw new AppError('Access denied', 402)
        } catch (error) {
            next(error)
        }
    })
}

const isAdmin = async (req, res, next) => {
    const { user } = req;
    try {
        const regUser = await User.findById(user._id).lean().exec()
        if (regUser.isAdmin) return next()
        throw new AppError('Not authorized to perform this operation', 403)
    } catch (error) {
        next(error)
    }
}

module.exports = { validateUser, requireAuth, isUser, isAdmin }
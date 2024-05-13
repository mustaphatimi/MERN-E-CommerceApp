const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AppError = require('../utilities/AppError');

const { Schema } = mongoose;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

userSchema.statics.register = async function (userData) {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
        throw new AppError('All fields are required', 401 )
    }
    if (!validator.isEmail(email)) {
        throw new AppError('Invalid email address', 401)
    }
    if (!validator.isStrongPassword(password)) {
        throw new AppError('Password not strong enough', 400)
    }
    const exists = await this.findOne({ email }).lean().exec();
    if (exists) {
        throw new AppError('Email already in use', 402)
    }
    const user = await this.create({ name, email, password })
    if (!user) {
        throw new AppError('Error creating user', 403)
    } 
    await user.save()
    return user;
}

userSchema.statics.login = async function (userData) {
    const { email, password } = userData;
    if (!email || !password) {
        throw new AppError('All fields are required...', 401 )
    }
    if (!validator.isEmail(email)) {
        throw new AppError('Invalid email address', 401)
    }
    let user = await this.findOne({ email }).exec()
    if (!user) {
        throw new AppError('Invalid email or password', 401)
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
        throw new AppError('Invalid email or password', 401)
    }
    user = await this.findOne({email}).select('-password')
    return user;
}

const User = mongoose.model('User', userSchema)

module.exports = User;
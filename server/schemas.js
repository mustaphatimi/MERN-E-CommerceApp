const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(8).max(200).required()
})

module.exports = { userSchema }
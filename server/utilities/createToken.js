const jwt = require('jsonwebtoken')

const createToken = async (_id) => {
    return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: '1h'} )
}

module.exports = {createToken}
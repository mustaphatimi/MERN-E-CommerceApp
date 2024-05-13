const moment = require('moment/moment')
const User = require('../models/user')
const AppError = require('../utilities/AppError');
const { trace } = require('joi');

const getUser = async (req, res, next) => {
    const {id } = req.params;
    try {
        const user = await User.find({ _id: id })
        if (user) {
            return res.status(200).json(user)
        }
        throw new AppError('User not found', 404)
    } catch (error) {
        next(error)
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
        if (users) {
            return res.status(200).json(users)
        }
        throw new AppError('Users not found', 404)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (id) {
            await User.findByIdAndDelete(id).then(() => {
            return res.status(203).json({message: 'User successfully deleted...'})
        })}
        throw new AppError('User not found', 404)
    } catch (error) {
        next(error)
    }
}

const getStats = async (req, res, next) => {
    const prevMonth = moment()
        .month(moment().month() - 1)
        .set('date', 1)
        .format('YYYY-MM-DD hh:mm:ss')
    
    const users = await User.aggregate([
        {
            $match: {
                createdAt : { $gte: new Date(prevMonth)}
            }
        },
        {
            $project: {
                month: {
                    $month: '$createdAt'
                }
            }
        },
        {
            $group: {
                _id: '$month',
                total: {$sum: 1}
            }
        }
    ])
    
    res.status(200).json(users)
}

module.exports = {
    getStats,
    getUser,
    getUsers,
    deleteUser
}
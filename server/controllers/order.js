const Order = require("../models/order")
const AppError = require("../utilities/AppError")
const moment = require('moment/moment')

const getOrderStats = async (req, res) => {
    const prevMonth = moment()
        .month(moment().month() - 1)
        .set('date', 1)
        .format('YYYY-MM-DD hh-mm-ss')

    try {
        const orders = await Order.aggregate([
        {
                $match: { createdAt: { $gte: new Date(prevMonth) } }
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
        if (orders) {
            return res.status(200).json(orders)
        }
        console.log('orders could not be calculated')
        throw new AppError('Error fetching orders', 403)
    } catch (error) {
        next(error)
    }
}

const getEarnings = async (req, res) => {
    const prevMonth = moment()
        .month(moment().month() - 1)
        .set('date', 1)
        .format('YYYY-MM-DD hh-mm-ss')

    try {
        const earnings = await Order.aggregate([
        {
                $match: { createdAt: { $gte: new Date(prevMonth) } }
        },
        {
            $project: {
                month: {
                    $month: '$createdAt'
                },
                sales: '$total'
            }
        },
        {
            $group: {
                _id: '$month',
                total: {$sum: '$sales'}
            }
        }
        ])
        if (earnings) return res.status(200).json(earnings)
        throw new AppError('Error fetching earnings', 403)
    } catch (error) {
        next(error)
    }
}

const getWeekStats = async (req, res, next) => {
    const lastWeekDate = () => {
        const now = new Date()
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 6
        )
    }

    try {
        const weeklySales = await Order.aggregate([
            {
                $match: { createdAt: { $gt: lastWeekDate() } }
            },
            {
                $project: {
                    day: {
                        $dayOfWeek: '$createdAt'
                    },
                    dayInYear: {
                        $dayOfYear: '$createdAt'
                    },
                    sales: '$total'
                }
            },
            {
                $group: {
                    _id: '$day',
                    total: { $sum: '$sales' },
                    yearDate: {$avg: '$dayInYear'}
                }
            },
                {
                $sort: { yearDate: 1}
        }
        ])
        if (weeklySales) return res.status(200).json(weeklySales)
        throw new AppError('Error fetching earnings', 403)
    } catch (error) {
        next(error)
    }
}

const getLatest = async (req, res, next) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).limit(3)
        if (orders) {
            return res.status(200).json(orders)
        }
        throw new AppError('Error fetching data', 402)
    } catch (error) {
        next(error)
    }
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 })
        if (orders) {
            return res.status(200).json(orders)
        }
        throw new AppError('Error fetching data', 402)
    } catch (error) {
        next(error)
    }
}

const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (id) {
            await Order.findByIdAndDelete(id).then(() => {
            return res.status(203).json({message: 'Order successfully deleted...'})
        })}
        throw new AppError('Order not found', 404)
    } catch (error) {
        next(error)
    }
}

const getOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (id) {
            await Order.findById({ _id: id }).then((result) => {
                return res.status(200).json(result)
            })
        }
        throw new AppError('Order not found...', 404)
    } catch (error) {
        next(error)
    }
}

const editOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, { ...req.body }, { new: true })
        if (order) {
            return res.status(201).json(order)
        }
        throw new AppError('Order not found...', 404)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOrderStats,
    getEarnings,
    getWeekStats,
    getLatest,
    getOrders,
    deleteOrder,
    getOrder,
    editOrder
}


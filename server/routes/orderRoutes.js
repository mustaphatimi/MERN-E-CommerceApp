const router = require('express').Router();
const { requireAuth, isAdmin } = require('../middlewares');
const {getOrderStats, getEarnings, getWeekStats, getLatest, getOrders, deleteOrder, getOrder, editOrder } = require('../controllers/order')
    

router.route('/')
    .get(requireAuth, isAdmin, getOrders)

router.route('/stats')
    .get(requireAuth, isAdmin, getOrderStats)

router.route('/latest')
    .get(requireAuth, isAdmin, getLatest)
    
router.route('/earnings')
    .get(requireAuth, isAdmin, getEarnings)

router.route('/week-stats')
    .get(requireAuth, isAdmin, getWeekStats)

router.route('/:id')
    .get(requireAuth, isAdmin, getOrder)
    .put(requireAuth, isAdmin, editOrder)
    .delete(requireAuth, isAdmin, deleteOrder)

module.exports = router;
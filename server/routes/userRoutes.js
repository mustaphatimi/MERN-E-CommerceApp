const router = require('express').Router()
const {getStats, getUser, getUsers, deleteUser} = require('../controllers/user');
const { isAdmin, requireAuth } = require('../middlewares');


router.route('/')
        .get(requireAuth, isAdmin, getUsers)

router.route('/stats')
        .get(requireAuth, isAdmin, getStats)
        
router.route('/:id')
        .get(requireAuth, getUser)
        .delete(requireAuth, isAdmin, deleteUser)
        

module.exports = router;
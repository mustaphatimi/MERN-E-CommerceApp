const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const {createProduct, getProducts, getProduct, deleteProduct, editProduct} = require('../controllers/product');
const { requireAuth, isAdmin } = require('../middlewares');

const router = express.Router()

router.route('/')
    .get(getProducts)
    .post(requireAuth, isAdmin, upload.single('image'), createProduct)

router.route('/:id')
    .put(requireAuth, isAdmin, upload.single('image'), editProduct)
    .get(requireAuth, isAdmin, getProduct)
    .delete(requireAuth, isAdmin, deleteProduct)


module.exports = router;
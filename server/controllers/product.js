const { cloudinary } = require("../cloudinary");
const Product = require("../models/product");
const AppError = require("../utilities/AppError");

const createProduct = async (req, res, next) => {
    const { name, brand, description, price } = req.body;
    const { path, filename } = req.file;
    const image = {
        url: path,
        filename
    }
    try {
       const product = await Product.create({
            name,
            brand,
            description,
            price,
            image
       })
        await product.save()
        return res.json(product)
    } catch (error) {
        next(new AppError('Error creating product', 401))
    }
}

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({})
        return res.json(products)
    } catch (error) {
        next(new AppError('Error fetching data', 402))
    }
}

const getProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.find({ _id: id })
        if(product)
            return res.json(product)
        throw new AppError('Product not found', 404)
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    if (id) {
        try {
            const product = await Product.findById(id)
                await cloudinary.uploader.destroy(product.image.filename)
                await Product.findByIdAndDelete(id)
            return res.json({ message: 'Product successfully deleted'})
    } catch (error) {
        next(new AppError('Action cannot be completed', 402))
    }
    }
}

const editProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, brand, description, price } = req.body;
    let image;
    if (req.file) {
        const { path, filename } = req.file;
        image = {
            url: path,
            filename
        }
    } else {
        image = req.body.image
    }
    try {
        const product = await Product.findById(id)
        if (image.filename !== product.image.filename) {
        await cloudinary.uploader.destroy(product.image.filename)
        }
        const newProduct = await Product.findByIdAndUpdate(id, {name, brand, description, price, image}, {new: true})
        await newProduct.save()
        return res.json(newProduct)
    } catch (error) {
        next(new AppError('Action cannot be completed', 402))
    }
}
module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    editProduct
}
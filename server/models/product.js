const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;
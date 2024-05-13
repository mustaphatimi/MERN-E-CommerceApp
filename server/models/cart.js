const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = Schema({
    cartOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cartTotalQuantity: {
        type: Number,
    },
    cartTotalAmount: {
        type: Number
    }
})

module.exports = mongoose.model('Cart', cartSchema);
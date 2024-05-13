const Product = require('../models/product');
const mongoose = require('mongoose')
const products = require('./product')
require('dotenv').config()

const dbUrl = process.env.dbUrl;

mongoose.connect(dbUrl || 'mongodb+srv://mustaphatimi_:AYvince98@mernapp.dis1mof.mongodb.net/myShup-App?retryWrites=true&w=majority')
    .then(() => {
        console.log('Products successfully seeded!!!')
    })
    .catch((err) => {
        console.log(err)
    })


const seedProducts = async () => {
        for (let product of products) {
            const { name, description, price, image } = product;
            const item = await new Product({
                name, description, price, image
            })
            await item.save()
        }
}
    
seedProducts()
    .then(() => {
    mongoose.connection.close()
})
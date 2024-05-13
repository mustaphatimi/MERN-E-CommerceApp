if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser')
const connectDB = require('./connectDB');
const AppError = require('./utilities/AppError');
const authRoutes = require('./routes/authRoutes');
const Product = require('./models/product');
const stripe = require('./routes/stripe');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Welcome to the myShup Api...')
})

app.get('/products', async (req, res) => {
    const products = await Product.find({})
    return res.status(200).json(products);
})
app.use('/auth', authRoutes);
app.use('/stripe', stripe);
app.use('/product', productRoutes)
app.use('/user', userRoutes)
app.use('/order', orderRoutes)

app.use('*', (req, res, next) => {
    next(new AppError('Page Not Found!...', 404))
})

app.use((err, req, res, next) => {
    const { message, statusCode = 500 } = err;
    if (!message) message = 'Oh No! Something went wrong...';
   return res.status(statusCode).json(message)
})

connectDB()
    .then(() => {
        app.listen(port, () => {
        console.log(`Server running on port ${port}!!`)
    })
})

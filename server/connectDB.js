const mongoose = require('mongoose');

const dbUrl = process.env.dbUrl;

const connectDB = async () => {
    mongoose.set('strictQuery', false);

    await mongoose.connect(dbUrl || 'mongodb+srv://mustaphatimi_:AYvince98@mernapp.dis1mof.mongodb.net/myShup-App?retryWrites=true&w=majority')
        .then(() => {
            console.log('Database connection successful')
        })
        .catch((err) => {
            console.log(err)
        })
}


module.exports = connectDB;
const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    });
    var log = {
        MONGODB: 'connected',
        URL: process.env.MONGO_URL,
        HOST: (await conn).connection.host
    }
    console.log(log);
}
module.exports = connectDB;
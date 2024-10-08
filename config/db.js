require('dotenv').config()
const mongoose = require('mongoose');

const uri = process.env.MONGO_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
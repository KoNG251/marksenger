const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 255
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 255
    },
    email: {
        type: String,
        require: true,
        maxlength: 255
    },
    password: {
        type: String,
        require: true,
        maxlength: 255
    },
    picture: {
        type: String,
        maxlength: 255
    },
    role: {
        type: String,
        require: true,
        maxlength: 6
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
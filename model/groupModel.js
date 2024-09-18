const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    picture: {
        type: String,
        required: true,
        maxlength: 255
    },
    create_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true       
    }
})

const Group = mongoose.model('groups',groupSchema);

module.exports = Group;
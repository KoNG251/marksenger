const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true 
    },
    body: {
        type: String,
        required: true 
    }
}, {
    timestamps: true 
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        require: true,
    },
    body: {
        type: String,
        required: true
    }
},{
    timestamps: true 
});

const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;
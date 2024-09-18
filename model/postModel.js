const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    body: {
        type: String,
    },
    tag: {
        type: String,
        require: true,
        maxlength: 255
    },
    picture: {
        type: String,
        maxlength: 255
    },
    status: {
        type: Number,
        required: true,
        maxlength: 1
    }
},{
    timestamps: true 
});

const Post = mongoose.model('posts', postSchema);

module.exports = Post;
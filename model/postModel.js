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

postSchema.virtual('comments', {
    ref: 'comments', // The model to use
    localField: '_id', // Find comments where `post_id` matches `_id`
    foreignField: 'post_id' // The post_id field in the Comment model
});

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

const Post = mongoose.model('posts', postSchema);

module.exports = Post;
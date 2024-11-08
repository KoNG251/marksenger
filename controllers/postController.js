require('../config/db');
require('dotenv').config();
const Post = require('../model/postModel');
const User = require('../model/userModel');
const Comment = require('../model/commentModel'); 

exports.create = async (req,res) => {
    const { body, tag } = req.body;

    if(!body){
        return res.status(400).json({
            message: "body or tag is required"
        });
    }

    try{

        const insertContent = await Post.create({
            user: req.user,
            body: body,
            picture: req.post_pic,
            status: 1
        });

        if(insertContent){
            return res.status(200).json({
                message: "content posting now waiting for admin validate"
            });
        }

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error
        })
    }

}

exports.edit = async (req,res) => {
    const { id, body, tag } = req.body;

    if(!id){
        return res.status(404).json({
            message : "post not found."
        });
    }

    if(!body || !tag){
        return res.status(400).json({
            message: "body or tag is required"
        });
    }

    try{

        const findPost = await Post.findById(id).exec();

        if(!findPost){
            return res.status(404).json({
                message : "post not found."
            });
        }

        if(findPost.user != req.user){
            return res.status(401).json({
                message : "user not match." 
            });
        }

        const updatePost = await Post.findByIdAndUpdate(
            {_id : id},
            {
                body: body,
                picture: req.post_pic,
                tag: tag,
            }
        )

        if(!updatePost){
            return res.status(401).json({
                message : "update failed."
            });
        }
        
        return res.status(200).json({
            message : "update success.",
            post: updatePost
        });

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error
        })
    }

}

exports.delete = async (req,res) => {
    
    const { id } = req.body;

    if(!id){
        return res.status(404).json({
            message : "post not found."
        });
    }

    try{

        const findPost = await Post.findById(id).exec();

        if(!findPost){
            return res.status(404).json({
                message : "post not found."
            });
        }

        if(findPost.user != req.user){
            return res.status(401).json({
                message : "user not match." 
            });
        }

        const deletePost = await Post.findByIdAndDelete(id).exec();

        if(!deletePost){
            return res.status(401).json({
                message : "delete post failed"
            });
        }

        return res.status(200).json({
            message : "delete post success"
        });

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error
        })
    }

}

exports.allPost = async(req,res) => {

    try{

        const posts = await Post.find({
            status: 1
        })
        .sort({ updatedAt: -1 })
        .populate({
            path:'user',
            select: 'firstname lastname picture'
        }) 
        .populate({
            path: 'comments',
            populate: {
                path: 'user_id', 
                select: 'firstname lastname picture'
            }
        });

        return res.status(200).json({
            message: posts
        })


    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error
        })
    }

}
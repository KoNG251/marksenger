require('../config/db');
const User = require('../model/userModel');
const post = require('../model/postModel');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config()
const Pusher = require("pusher");


exports.login = async (req,res) => {

    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({
            message: "Email and password are required"
        })
    }

    try{

        const validateEmail = await User.findOne({
            "email" : email,
            "role" : "admin"
        })
    
        if(!validateEmail){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
    
        const validatePassword = await bcrypt.compare(password, validateEmail.password);

        if(!validatePassword){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = await jwt.sign({ id: validateEmail._id}, process.env.SECRET_ADMIN , { expiresIn: '12h' });
        return res.status(200).json({
            message: "login success",
            token
        })

    }catch(error){
        return res.status(500).json({
            message: 'Error: ' + error
        });
    }

}

exports.getNotValidatePost = async (req,res) => {

    try{
        
        const requestNotValidatePost = await post.find({
            status : 0
        }).sort({ createdAt: -1 })
        .populate({
            path:'user',
            select: 'firstname lastname picture'
        }) 

        return res.status(200).json({
            message : requestNotValidatePost
        });

    }catch(error){

        return res.status(500).json({
            message: 'Error: ' + error
        });

    }

}

exports.validatePost = async (req, res) => {
    const { id, status } = req.body;

    // Check if 'id' and 'status' are provided
    if (!id || !status) {
        return res.status(400).json({
            message: "id or status is required"
        });
    }

    // Initialize Pusher
    const pusher = new Pusher({
        appId: process.env.APP_PUSHER_ID,
        key: process.env.APP_PUSHER_KEY,
        secret: process.env.APP_PUSHER_SECRET,
        cluster: "ap1",
        useTLS: true
    });

    try {
        const requestValidate = await post.findByIdAndUpdate(
            id,
            { status },
            { new: true } 
        ).populate({
            path: 'user',
            select: 'firstname lastname picture'
        }).populate({
            path: 'comments',
            populate: {
                path: 'user_id',
                select: 'firstname lastname picture'
            }
        });

        if (!requestValidate) {
            return res.status(400).json({
                message: "Validation failed, post not found or could not be updated."
            });
        }

        if (parseInt(status) === 1) {
            pusher.trigger("post", "lastedpost", {
                message: requestValidate
            });
        }

        return res.status(200).json({
            message: 'Post successfully validated'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Error: ${error.message}`
        });
    }
};

exports.logout = async (req,res) => {

    try{
        return res.status(200).json({ message: 'Logout successful' });
    }catch(error){
        return res.status(500).json({
            message: "Error: " + error.message
        });
    }

}
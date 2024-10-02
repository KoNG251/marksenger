require('../config/db');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require('dotenv').config()
const User = require('../model/userModel');

exports.auth = async (req, res, next) => {

    try{
        const token = req.headers['authtoken']
        if(!token){
            return res.status(500).json({
                message: "Invalid token"
            })
        }

        const decoded = await jwt.verify(token,process.env.SECRET_ADMIN);

        const user = await User.findById(decoded.id).exec();

        if(!user){
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded.id

        next();
    }catch(error){
        res.status(500).json({
            message: error
        })
    }

}
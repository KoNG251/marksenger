require('../config/db');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config()


exports.login = async (req,res) => {

    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({
            message: "Email and password are required"
        })
    }

    try{

        const validateEmail = await User.findOne({"email" : email})
    
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

        const token = await jwt.sign({ id: validateEmail._id}, process.env.SECRET , { expiresIn: '12h' });
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

exports.register = async (req,res) => {

    const {firstname, lastname, email, password, confirm_password} = req.body

    if(!firstname || !lastname || !email || !password || !confirm_password){
        return res.status(400).json({
            message: "invalid method"
        })
    }

    const existingUser = await User.findOne({"email" : email });

    if (existingUser) {
        return res.status(401).json({
            message: "Email already exists"
        });
    }

    if (password !== confirm_password) {
        return res.status(401).json({
            message: "Passwords do not match"
        });
    }    

    if(password.length < 8){
        return res.status(401).json({
             message: "Password must be at least 8 characters long."
        })
    }
    
    try{
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds)
    
        const userData = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashPassword,
            role: "member"
        });
    
        await userData.save()

        if(userData){
            return res.status(200).json({
                message: "store data success!"
            })
        }
    }catch(error){
        return res.status(500).json({
            message: 'Error store data: ' + error.message
        });
    }

}

exports.editprofile = async (req, res) => {
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
        return res.status(400).json({
            message: "firstname and lastname are required"
        });
    }

    try {

        const updateInfo = await User.findOneAndUpdate(
            { _id: req.user },
            { firstname, lastname },
            { new: true } 
        ).exec();

        if (!updateInfo) {
            return res.status(500).json({
                message: "Failed to update profile"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updateInfo 
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating profile: " + error.message
        });
    }
}


exports.changeavatar = async (req,res) => {

    
    if(req.error){
        return res.status(400).json({
            message : req.error
        });
    }

    if(!req.avatar){
        return res.status(400).json({
            message : "avatar is required"
        });
    }

    try{

        const updateAvatar = await User.findByIdAndUpdate(
            {
                _id: req.user
            },
            {
                picture: req.avatar
            }
        );

        if(!updateAvatar){
            return res.status(500).json({
                message: "Failed to update profile"
            });
        }

        return res.status(200).json({
            message: "Update profile success!",
            user: updateAvatar
        });

    }catch(error){
        return res.status(500).json({
            message: "Error updating profile: " + error.message
        });
    }

}

exports.deleteProfile = async (req,res) => {

    try{
        
        const deleteUser = User.findByIdAndDelete(req.user).exec();

        if(!deleteUser){
            return res.status(401).json({
                message: "delete profile failed!"
            });
        }

        return res.status(200).json({
            message: "delete profile success"
        });

    }catch(error){
        return res.status(500).json({
            message: "Error delete profile: " + error.message
        });
    }
}

exports.changePassword = async (req,res) => {

    const {old_password , new_password} = req.body

    try{

        const user = await User.findById(req.user).exec();
        const validatePassword = await bcrypt.compare(old_password, user.password);

        if(!validatePassword){
            return res.status(401).json({
                message : "Old password do not match."
            });
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(new_password, saltRounds)

        const update = await User.findByIdAndUpdate(
            {
                _id : req.user
            },
            {
                password : hashPassword
            }
        )

        if(!update){
            return res.status(400).json({
                message : "update password failed!"
            });
        }

        return res.status(200).json({
            message : "update password success.",
            user: update
        });
        

    }catch(error){
        return res.status(500).json({
            message: "Error: " + error.message
        });
    }

}

exports.profile = async (req,res) => {

    try{

        const user = await User.findById(req.user).exec();

        if(!user){
            return res.status(404).json({
                message : "Not found user."
            });
        }

        return res.status(200).json({
            message: user
        });

    }catch(error){
        
        return res.status(500).json({
            message: "Error: " + error.message
        });

    }

}

exports.logout = async (req,res) => {

    try{
        return res.status(200).json({ message: 'Logout successful' });
    }catch(error){
        return res.status(500).json({
            message: "Error: " + error.message
        });
    }

}
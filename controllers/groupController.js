require('../config/db');
const { response } = require('express');
const group = require('../model/groupModel');
const member = require('../model/memberModel');
const messageModel = require('../model/messageModel');
const Pusher = require("pusher");
require('dotenv').config()

exports.create = async (req,res) => {
    const { name } = req.body

    if(!name){
        return res.status(401).json({
            message : "name is required"
        });
    }

    if(req.error){
        return res.status(400).json({
            message : req.error
        });
    }

    try{

        const create = await group.create({
            name : name,
            picture : req.profile,
            create_id : req.user
        });
        const createMember = await member.create({
            user_id : req.user,
            group_id : create._id
        })

        if(!create || !createMember){
            return res.status(400).json({
                message : "create group failed."
            });
        }

        return res.status(200).json({
            message : "create group success.",
            group : create
        });

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error.message
        })
    }

}

exports.delete = async (req,res) => {

    const { id } = req.body

    if(!id){
        return res.status(401).json({
            message : "group is required"
        });
    }

    try{
        
        const validateGroup = await group.findById(id).exec();

        if(!validateGroup){
            return res.status(404).json({
                message : "not found the group"
            })
        }

        if(validateGroup.create_id != req.user){
            return res.status(401).json({
                message : "you are not creater"
            });
        }

        const deleteGroup = await group.findByIdAndDelete(id);

        if(!deleteGroup){
            return res.status(400).json({
                message : "failed to delete the group."
            });
        }

        return res.status(200).json({
            message : "delete success"
        });

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error.message
        })
    }

}

exports.join = async (req,res) => {

    const { id } = req.body

    if(!id){
        res.status(400).json({
            message : "Group id is required"
        });
    }

    try{

        const groupExist = await group.findById(id).exec();

        if(!groupExist){
            return res.status(401).json({
                message : 'Group not found!'
            });
        }

        const requestJoinGroup = await member.create({
            user_id : req.user,
            group_id: id
        })

        if(!requestJoinGroup){
            return res.status(400).json({
                message : "Have a problem to join group."
            })
        }

        return res.status(200).json({
            message : "Join group success."
        });

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error.message
        })
    }
}

exports.selectGroup = async (req,res) => {

    try{
        
        const requestSelectGroup = await member.find(
            {
                user_id : req.user
            }
        )
        .populate('user_id')
        .populate('group_id')

        return res.status(200).json({
            message : requestSelectGroup
        });

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error.message
        })
    }

}

exports.getMember = async (req,res) => {

    const { id } = req.body;

    if(!id){
        return res.status(400).json({
            message: "id is required"
        });
    }

    try{

        const requestGetMemberGroup = await member.find(
            {
                group_id: id
            }
        ).populate("user_id")

        return res.status(200).json({
            message: requestGetMemberGroup
        });

    }catch(error){
        return res.status(500).json({
            message: "server error : "+ error.message
        })
    }

}

exports.sendMessage = async (req, res) => {
    const { id, body } = req.body;

    if (!id || !body) {
        return res.status(400).json({
            message: 'id and body are required.'
        });
    }

    const pusher = new Pusher({
        appId: process.env.APP_PUSHER_ID,
        key: process.env.APP_PUSHER_KEY,
        secret: process.env.APP_PUSHER_SECRET,
        cluster: "ap1",
        useTLS: true
      });

    try {
        // Create a new message
        const requestSendMessage = await messageModel.create({
            sender_id: req.user,
            group_id: id,
            body: body
        });

        if (!requestSendMessage) {
            return res.status(400).json({
                message: "There was a problem sending the message."
            });
        }

        const lastedMessageGetRequest = await messageModel.findById(requestSendMessage._id)
            .populate('sender_id')
            .populate('group_id');

        pusher.trigger("message", "group-"+id, {
            message: lastedMessageGetRequest
        });


        return res.status(200).json({
            message: "Send message success."
        });


    } catch (error) {
        return res.status(500).json({
            message: "Server error: " + error.message
        });
    }
};


exports.getMessage = async (req,res) => {

    const { id } = req.params

    if(!id) {
        return res.status(400).json({
            message : "id is required"
        });
    }

    try{

        const requestGetMessage = await messageModel.find({
            group_id: id
        }).populate('sender_id')
        .populate('group_id');

        if(!requestGetMessage){
            return res.status(400).json({
                message : 'get message have a problem.'
            });
        }

        return res.status(200).json({
            message : requestGetMessage
        });

    }catch(error){
        return res.status(500).json({
            message: "Server error: " + error.message
        });
    }

}

exports.findAllGroup = async (req,res) => {

    try{

        const userGroups = await member.find({ user_id: req.user }).select('group_id');

        const groupIds = userGroups.map(member => member.group_id);

        const groupsWithoutUser = await group.find({ _id: { $nin: groupIds } });


        return res.status(200).json({
            message : groupsWithoutUser
        })

    }catch(error){

    }

}
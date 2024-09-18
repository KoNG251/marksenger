require('../config/db');
const group = require('../model/groupModel');

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

        const create = group.create({
            name : name,
            picture : req.profile,
            create_id : req.user
        });

        if(!create){
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
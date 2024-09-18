require('../config/db');
const comment = require('../model/commentModel'); 
const post = require('../model/postModel'); 

exports.comment = async (req,res) => {

    const { id, body } = req.body

    if(!body || !id){
        return res.status(400).json({
            message : "Post id is required"
        });
    }

    try{

        const findPost = await post.findById(id).exec();

        if(!findPost){
            return res.status(404).json({
                message : "post not found."
            });
        }

        if(findPost.status == 0 || findPost.status == "0"){
            return res.status(401).json({
                message : "admin not allow post."
            });
        }


        const createComment = await comment.create({
            user_id : req.user,
            body : body,
            post_id : id
        });

        if(!createComment){
            return res.status(401).json({
                message : "create comment failed."
            });
        }

        return res.status(200).json({
            message : "comment success."
        });

    }catch(error){

        return res.status(500).json({
            message : "Error : "+error.message
        });

    }

}

exports.edit = async (req,res) => {

    const { id , body } = req.body

    if(!id || !body){
        return res.status(401).json({
            message : "body is required"
        });
    }


    try{
        const findComment = await comment.findById(id).exec()

        if(!findComment){
            return res.status(404).json({
                message : "404 Not found"
            })
        }

        if(findComment.user_id != req.user){
            return res.status(401).json({
                message : "Invalid user."
            });
        }
        
        const updateComment = await comment.findByIdAndUpdate(
            {_id : id},
            {
                body : body
            }
        )

        if(!updateComment){
            return res.status(400).json({
                message : "Update failed."
            });
        }

        return res.status(200).json({
            message : "update success",
            comment : updateComment
        })

    }catch(error){

    }
}
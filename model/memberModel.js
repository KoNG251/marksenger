const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true       
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true  
    }
})

const Member = mongoose.model('member_groups',memberSchema);

module.exports = Member;
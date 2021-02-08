const mongoose = require('mongoose');
const Schema = mongoose.Schema

const AccountSchema = new mongoose.Schema({
    email : {
        type: String,
        unique : true,
        trim: true,
        required : true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    user:{
        type:   Schema.Types.ObjectId,
        ref: 'User'
    },
    date:{
        type: Date,
        default: Date.now
    }


})

module.exports = Account = mongoose.model('Account', AccountSchema);
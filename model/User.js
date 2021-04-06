const mongoose = require('mongoose');
const { schema } = require('./postText');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email : {
        type: String,
        unique : true,
        trim: true,
        required : true,
    },
    avatar:{
        type: String
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    firstname : {
        type: String,
        require : true
    },
    lastname :{
        type: String,
        require : true,
    },
    school : {
        type: String,
        require: true
    },

    major :{
        type: String,
        require : true
    },

    role : {
        type: String
    },
    skills: {
        type: [String]
    },

    interest : {
        type : [String]
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('User', UserSchema)
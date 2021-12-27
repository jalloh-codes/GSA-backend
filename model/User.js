const mongoose = require('mongoose');
const { schema } = require('./postText');
const Schema = mongoose.Schema


//User Schema (Table)
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
    confirmed :{
        type: Boolean,
        default: false
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


// UserSchema.virtual('fullname').get(function () {
//     return [this.firstname, this.lastname].filter(Boolean).join(' ');
// });

module.exports = User = mongoose.model('User', UserSchema)

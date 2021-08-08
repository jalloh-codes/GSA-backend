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

//UserSchema.index({firstname: 'text'})
<<<<<<< HEAD
//UserSchema.index({email: 'text'})
=======
// UserSchema.index({email: 'text'})
>>>>>>> 2c6b9f6b98f88ebd6163c42317f47930d8ed4234
// UserSchema.index({lastname: 'text'})
// UserSchema.index({firstname: 'text'})


module.exports = User = mongoose.model('User', UserSchema)

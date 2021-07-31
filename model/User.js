const mongoose = require('mongoose');
const { schema } = require('./postText');
const Schema = mongoose.Schema


//User Schema (Table)
const UserSchema = new Schema({
<<<<<<< HEAD
    account:{
        type: Schema.Types.ObjectId,
        ref: 'Account'
=======
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
>>>>>>> cellou
    },
    firstname : {
        type: String,
        require : true
<<<<<<< HEAD
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
      interest : [{type:String}]
      
=======
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
>>>>>>> cellou
})

//UserSchema.index({firstname: 'text'})
UserSchema.index({email: 'text'})
UserSchema.index({lastname: 'text'})
UserSchema.index({firstname: 'text'})


module.exports = User = mongoose.model('User', UserSchema)
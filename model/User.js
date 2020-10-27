const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    account:{
        type: Schema.Types.ObjectId,
        ref: 'Account'
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
   
      interest : {
          type : [String]
      }
})

module.exports = User = mongoose.model('User', UserSchema)
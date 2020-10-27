const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstname : {
        type: String,
        require : true
      },
      lastname :{
          type: String,
          require : true,
      },
      post:[
          {
              type: Schema.Types.ObjectId,
              ref: 'PostText'
          }
      ],
      interest : {
          type : [String]
      }
})

module.exports = User = mongoose.model('User', UserSchema)
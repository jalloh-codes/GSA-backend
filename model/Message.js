const mongoose = require('mongoose');
const Schema = mongoose.Schema



const MessageSchema = new Schema({
    room:{
        type: String,
        require: true
    },
    author:{
        type:   Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    body:{
        type: String
    },
    createAt:{
        type: Date,
        require: true
    }
})

module.exports = Message = mongoose.model('Message', MessageSchema)
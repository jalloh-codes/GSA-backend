const mongoose = require('mongoose');
const User = require('./User');
const { schema } = require('./User');
const Schema = mongoose.Schema

const postTextSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    text:{
        type: String
    },
    commnets:[
        {
            type:   Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})


module.exports = PostText = mongoose.model('PostText', postTextSchema)
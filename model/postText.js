const mongoose = require('mongoose');

const Schema = mongoose.Schema

const postTextSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    text:{
        type: String
    },
    commnets:[
        {
            type:   Schema.Types.ObjectId,
            ref: "Account",
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Account",
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})


module.exports = PostText = mongoose.model('PostText', postTextSchema)
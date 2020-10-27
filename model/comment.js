const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commnetSchema = new Schema({
    post:{
        type:   Schema.Types.ObjectId,
        ref: "Post",
    },
    text:{
        type: String
    },
    byUser:{
        type:   Schema.Types.ObjectId,
        ref: "User",
    },
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

module.exports = Comments = mongoose.model('Commnet', commnetSchema)
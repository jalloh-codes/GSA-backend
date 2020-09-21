const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postSchema = new Schema({
    status:{
        type: String
    },
    imageAlbum:[
        {image:{
            type: Buffer
        }}
    ],
    vedioAlbum:[
        {video:{
            type: Buffer
        }}
    ],
    commnets:[
        {
            user:{
             type:   Schema.Types.ObjectId,
             ref: "User"
            },
            text:{
                type: String,
                require: true
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    likes: [
        {
            user:{
                type: Schema.Types.ObjectId,
                ref: "User",
                require: true
            },
            times:{
                type: Number
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})


module.exports = Post = mongoose.model('Post', postSchema)
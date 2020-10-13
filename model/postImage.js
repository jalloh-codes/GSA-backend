const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postImageSchema = new Schema({
    imageAlbum:[{
        image:{
        type: Buffer
        }
    }],
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


module.exports = PostImage = mongoose.model('PostImage', postImageSchema)
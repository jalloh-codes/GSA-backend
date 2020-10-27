const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postImageSchema = new Schema({
    imageAlbum:[
        {
            type: String
        }
    ],
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


module.exports = PostImage = mongoose.model('PostImage', postImageSchema)
//this schema discribe the PostImage document fields
const mongoose = require('mongoose');
const Schema = mongoose.Schema


// ImagePost schema(Table)
// Required User ID
const postImageSchema = new Schema({
    //onwer of the Post ID
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // image as url(link) Array of object
    imageAlbum:[
        {
            type: String
        }
    ],
    text:{
        type: String
    },

    // commnet ID from the Comment Schemma(table) 
    commnets:[
        {
            type:   Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    // User ID only
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
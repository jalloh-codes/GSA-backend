//this schema discribe the PostText document fields

const mongoose = require('mongoose');
const Schema = mongoose.Schema


//PostText Schema(Table)
const postTextSchema = new Schema({
    //onwer of the Post ID
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    text:{
        type: String
    },
     //commnet ID from the Comment Schemma(table) 
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
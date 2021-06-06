//this schema discribe the Comment document fields

const mongoose = require('mongoose');
const Schema = mongoose.Schema


// Comment shema document (table)
// PostImage and PsoText Comment Schema
// schema field PostImage OR PsoText ID
//  User ID
const commnetSchema = new Schema({
    post:{
        type:   Schema.Types.ObjectId,
        ref: "PostText" ? "PostText": "PostImage",
        // postImage 
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

module.exports = Comments = mongoose.model('Comment', commnetSchema)
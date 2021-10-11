const mongoose = require('mongoose');
const { schema } = require('./postText');
const Schema = mongoose.Schema

//User Schema (Table)
const VerifySchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    code: {
        type: String,
        unique : true,
        trim: true,
        required : true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = User = mongoose.model('Verify', VerifySchema)
import mongoose, { Schema } from 'mongoose';
const { schema } = mongoose;

const userSchema = new Schema ({
    
    email: {
        type: String, 
        required: true, 
        trim: true},

    password: {
        type: String, 
        required: true,
        trim: true}


})

module.exports = mongoose.model("User", userSchema)
const mongoose = require('mongoose');
const schema = mongoose.schema;

const AccountSchema = new mongoose.Schema({
    email : {
        type: String,
        unique : true,
        trim: true,
        required : true,
    },

    password:{
        type: String,
        required: true,
        trim: true,
    },

    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = Account = mongoose.model('Account', AccountSchema);
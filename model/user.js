const mongoose = require ('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({

    account:{
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    firstname : {
        type: String,
        require : true
    },
    lastname :{
        type: String,
        require : true,
    },
    school : {
            type: String,
            require: true
    },

    major :{
        type: String,
        require : true
    },

    role : {
        type: String
    },

    interest : {
        type : [String]
    }

})

module.exports = user = mongoose.model('User',userSchema);
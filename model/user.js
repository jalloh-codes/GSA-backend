const mongoose = require ('mongoose');
const schema = mongoose.schema;

const userSchema = new mongoose({
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
       type: String,
       require : false
   },

   interest : {
       type : String,
       require : false
   }

})

module.exports = user = mongoose.model('user',userSchema);
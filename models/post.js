const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({ 
        name : {
            type:String,
            required:true
        },
        price:{
            type:String,
            required:false
        }
}); 

const PostModel = mongoose.model("post" ,PostSchema)
module.exports = PostModel
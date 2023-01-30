const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
    },
    isLoggedin:{
        type: Boolean
    },
    isLogout:{
        type: Boolean
    }
},{timestamps: true})

const LoginUser = mongoose.model('loginuser', LoginSchema)
module.exports = LoginUser;
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({

    email:{
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'admin'
    },
    secretkey: {
        type: String,
    }


    
},{timestamps: true});

const AdminRegister = mongoose.model('admin',UserSchema);
module.exports = AdminRegister; 
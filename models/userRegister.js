const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({

    registrationnumber:{
        type: Number,
        required: false,
        unique: true,
    },
    name:{
        type: String,
        required: false,
    },
    email:{
        type: String,
        required: false,
        unique: true,

    },

    phone:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: false,
    },
    role:{
        type: String,
        default: 'candidate'
    }
    
},{timestamps: true});

const UserRegistration = mongoose.model('userregistration',UserSchema);
module.exports = UserRegistration;
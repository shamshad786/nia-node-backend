const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    galleryImageUrl:{
        type: String,
    }
},{timestamps: true});


const gallery = mongoose.model('Gallery', gallerySchema);

module.exports = gallery;
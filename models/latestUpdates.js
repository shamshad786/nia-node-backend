const mongoose = require('mongoose');

const latestUpdateSchema = new mongoose.Schema({
    list: {
        type: String,
        trim: true
    }
});
const latestUpdate = mongoose.model('LatestUpdate', latestUpdateSchema)

module.exports = latestUpdate;


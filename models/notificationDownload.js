const mongoose = require('mongoose');

const notificationDownload = new mongoose.Schema({
    notificationurlenglish: {
        type: String
    },
    notificationurlhindi: {
        type: String
    }
});


const notificationURL = mongoose.model('Notificationurl', notificationDownload);

module.exports = notificationURL;
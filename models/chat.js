var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Chat = new Schema({
    shortname: String,
    message: {
        type: String,
        trim: true,
    },
    created: { 
        type: Date, 
        default: Date.now
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', unique: true },
    sentTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', unique: true },
    modified: Date     
});

module.exports = mongoose.model('Chat', Chat);
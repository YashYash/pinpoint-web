var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    username: String,
    modified: Date     
});

module.exports = mongoose.model('Chat', Chat);
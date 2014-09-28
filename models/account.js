var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true
    },
    password: String,
    type: {type:String, default:"user"},
    created: { 
        type: Date, 
        default: Date.now
    },
    modified: Date     
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
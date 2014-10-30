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
  type: {
    type: String,
    default: 'user'
  },
  created: {
    type: Date,
    default: Date.now
  },
  email: String,
  loggedIn: String,
  ads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ads',
    unique: true
  }],
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    unique: true
  }],
  modified: Date
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);

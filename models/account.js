var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10

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
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Ads',
    unique: true
  }],
  modified: Date
});

Account.plugin(passportLocalMongoose);

Account.pre('save', function(next) {
  var account = this;
  if(!account.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(account.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          account.password = hash;
          next();
      });
  });  
});

Account.methods.comparePassword = function(password, cb) {
  console.log('Comparing passwords');
  console.log(password);
  bcrypt.compare(password, this.password, function(err, isMatch) {
    console.log("still comparing");
    if(err) {
      console.log(err);
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
};
module.exports = mongoose.model('Account', Account);

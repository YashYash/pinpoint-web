var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Url = new Schema({
      route: String
    , code: String
    , zone: {type: mongoose.Schema.Types.ObjectId, ref: 'Zone'}
    , type: String
    , category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
    , modified: Date
});

module.exports = mongoose.model('Url', Url);
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

var Ads = new Schema({
  shortname: String,
  title: {
    type: String,
    trim: true,
  },
  url: String,
  created: {
    type: Date,
    default: Date.now
  },
  price: String,
  address: String,
  seller: String,
  make: String,
  model: String,
  kilometers: String,
  miles: String,
  vehicletype: String,
  transmission: String,
  color: String,
  drive: String,
  fuel: String,
  description: String,
  source: String,
  petfriendly: String,
  furnished: String,
  bathrooms: String,
  rentby: String,
  size: String,
  tags: [],
  zone: String,
  listed: String,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  lng: String,
  lat: String,
  geo: {
    type: [Number],
    index: '2d'
  },
  images: [],
  modified: Date
});

module.exports = mongoose.model('Ads', Ads);

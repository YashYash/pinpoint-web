var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Category = new Schema({
    shortname: String,
    name: {
        type: String,
        trim: true,
    },
    created: { 
        type: Date, 
        default: Date.now
    },
    type: {
        type: String
    },
    ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ads', unique: true }],
    urls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Url', unique: true }],
    modified: Date     
});

module.exports = mongoose.model('Category', Category);
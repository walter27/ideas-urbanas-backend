const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var stopwordsSchema = require('./schemas/stopwordsSchema');

var Stopword = mongoose.model('Stopword', stopwordsSchema);

module.exports = Stopword;
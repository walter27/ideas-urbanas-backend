const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var wordSchema = require('./schemas/wordSchema');

wordSchema.plugin(mongoosePaginate);

var Word = mongoose.model('Word', wordSchema);

module.exports = Word;
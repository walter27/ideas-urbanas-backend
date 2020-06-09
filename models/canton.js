const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var cantonSchema = require('./schemas/cantonSchema');

cantonSchema.plugin(mongoosePaginate);

var Canton = mongoose.model('Canton', cantonSchema);

module.exports = Canton;
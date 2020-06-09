const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var dataSchema = require('./schemas/dataSchema');

dataSchema.plugin(mongoosePaginate);

var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
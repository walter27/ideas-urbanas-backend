const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var indicatorSchema = require('./schemas/indicatorSchema');

indicatorSchema.plugin(mongoosePaginate);

var Indicator = mongoose.model('Indicator', indicatorSchema);

module.exports = Indicator;
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var reportsSchema = require('./schemas/reportsSchema');

reportsSchema.plugin(mongoosePaginate);

var Reports = mongoose.model('Reports', reportsSchema);

module.exports = Reports;
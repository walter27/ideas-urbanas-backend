const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var provinciaSchema = require('./schemas/provinciaSchema');

provinciaSchema.plugin(mongoosePaginate);

var Provincia = mongoose.model('Provincia', provinciaSchema);

module.exports = Provincia;
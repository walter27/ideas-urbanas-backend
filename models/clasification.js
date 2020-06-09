const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var clasificationSchema = require('./schemas/clasificationSchema');

clasificationSchema.plugin(mongoosePaginate);

var Clasification = mongoose.model('Clasification', clasificationSchema);

module.exports = Clasification;
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var originSchema = require('./schemas/originSchema');

originSchema.plugin(mongoosePaginate);

var Origin = mongoose.model('Origin', originSchema);

module.exports = Origin;
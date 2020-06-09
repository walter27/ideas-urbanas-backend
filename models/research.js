const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var researchSchema = require('./schemas/researchSchema');

researchSchema.plugin(mongoosePaginate);

var Research = mongoose.model('Research', researchSchema);

module.exports = Research;
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var variableSchema = require('./schemas/variableSchema');

variableSchema.plugin(mongoosePaginate);

var Variable = mongoose.model('Variable', variableSchema);

module.exports = Variable;
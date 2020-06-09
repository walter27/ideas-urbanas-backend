const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var configSchema = require('./schemas/configSchema');

configSchema.plugin(mongoosePaginate);

var Config = mongoose.model('Config', configSchema);

module.exports = Config;
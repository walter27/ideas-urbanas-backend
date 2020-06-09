const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var tagSchema = require('./schemas/tagSchema');

tagSchema.plugin(mongoosePaginate);

var Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
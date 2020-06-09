
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var userSchema = require('./schemas/userSchema');

userSchema.plugin(mongoosePaginate);

var User = mongoose.model('User', userSchema);

module.exports = User;
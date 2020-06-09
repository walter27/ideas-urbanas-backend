const mongoose = require('mongoose');


var configSchema = new mongoose.Schema({
    name: {type: String, required: true},
    value: {type: String, required: true}
});


module.exports = configSchema;
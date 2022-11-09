const mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({

    obj_Canton: { type: Object, required: true },
    obj_Word: { type: Object, required: true },
});

module.exports = tagSchema;
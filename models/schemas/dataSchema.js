const mongoose = require('mongoose');

var dataSchema = new mongoose.Schema({

    value: Object,
    description: { type: String },
    year: { type: Number, required: true },
    obj_Canton: { type: Object, required: true },
    obj_Variable: { type: Object, required: true },
    date: { type: Date },
    active: Boolean
});

module.exports = dataSchema;
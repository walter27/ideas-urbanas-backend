const mongoose = require('mongoose');

var indicatorSchema = new mongoose.Schema({

    obj_Variable: { type: Object, required: true },
    obj_Canton: { type: Object, required: true },
    ridit: Object,
    year: { type: Number }
});

module.exports = indicatorSchema;
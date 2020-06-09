const mongoose = require('mongoose');

var indicatorSchema = new mongoose.Schema({

    name: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    description: { type: String },
    obj_Clasification: { type: Object, required: true },
    configs: [Object]
});

module.exports = indicatorSchema;
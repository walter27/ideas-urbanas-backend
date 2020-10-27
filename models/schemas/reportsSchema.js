const mongoose = require('mongoose');

var reportsSchema = new mongoose.Schema({

    name: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    description: { type: String, required: true },
    image_route: { type: String, required: true },
    image_contentType: { type: String, required: true },
    active: Boolean,
    url: { type: String, required: true }

});

module.exports = reportsSchema;
const mongoose = require('mongoose');

const { category } = require('../../const/category');

var researchSchema = new mongoose.Schema({

    title: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    author: { type: String, required: true, minlength: [3, "El autor debe contener al menos 3 caracteres."] },
    year: { type: String, required: true },
    link: { type: String, required: true },
    category: { type: String, enum: { values: category, message: "Categoría desconocida." } },
    //image_route: { type: String, required: true },
    //image_contentType: { type: String, required: true },
    obj_Canton: { type: Object, required: true },
    active: Boolean
});

module.exports = researchSchema;
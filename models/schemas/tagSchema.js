const mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    
    text: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    obj_Canton: {type: Object, required: true},
    type: { type: String, required: true}
}); 

module.exports = tagSchema;
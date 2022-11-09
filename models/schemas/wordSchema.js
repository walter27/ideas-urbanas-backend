const mongoose = require('mongoose');
const TagModel = require('../tag');


var wordSchema = new mongoose.Schema({

    text: { type: String, required: true },
    type: { type: String, required: true }
});

wordSchema.post('save', function(word, next) {

    //Actualizar tag
    TagModel.updateMany({ 'obj_Word._id': word._id }, { 'obj_Word': word }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });



});

module.exports = wordSchema;
const mongoose = require('mongoose');

const DataModel = require('../data');
const ResearchModel = require('../research');
const TagModel = require('../tag')

var cantonSchema = new mongoose.Schema({

    name: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    description: { type: String },
    code: { type: String, required: true },
    url: { type: String, },
    obj_Provincia: { type: Object, required: true },
    is_intermediate: Boolean,
    covid: Boolean,
    indexes: Boolean,
    extraData: Object,
    color: { type: String }
});

cantonSchema.post('save', function(canton, next) {

    //Actualizar Research
    ResearchModel.updateMany({ 'obj_Canton._id': canton._id }, { 'obj_Canton': canton }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

    //Actualizar Data
    DataModel.updateMany({ 'obj_Canton._id': canton._id }, { 'obj_Canton': canton }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });


    //Actualizar nube
    TagModel.updateMany({ 'obj_Canton._id': canton._id }, { 'obj_Canton': canton }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

});

module.exports = cantonSchema;
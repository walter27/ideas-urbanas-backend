const mongoose = require('mongoose');

const CantonModel = require('../canton');
const DataModel = require('../data');
const ResearchModel = require('../research');
const TagModel = require('../tag')


var provinciaSchema = new mongoose.Schema({

    name: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    description: { type: String },
    active: Boolean
});

provinciaSchema.post('save', function(provincia, next) {

    //Actualizar Cantón
    CantonModel.updateMany({ 'obj_Provincia._id': provincia._id }, { 'obj_Provincia': provincia }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

    //Actualizar Research
    ResearchModel.updateMany({ 'obj_Canton.obj_Provincia._id': provincia._id }, { 'obj_Canton.obj_Provincia': provincia }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

    //Actualizar Data
    DataModel.updateMany({ 'obj_Canton.obj_Provincia._id': provincia._id }, { 'obj_Canton.obj_Provincia': provincia }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

    //Actualizar tag
    TagModel.updateMany({ 'obj_Canton.obj_Provincia._id': provincia._id }, { 'obj_Canton.obj_Provincia': provincia }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

});

module.exports = provinciaSchema;
const mongoose = require('mongoose');

const DataModel = require('../data');
const VariableModel = require('../variable');
const IndicatorModel = require('../indicator');

var clasificationSchema = new mongoose.Schema({

    name: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    image_route: { type: String, required: true },
    image_contentType: { type: String, required: true },
    //image_active_route: { type: String },
    //image_active_contentType: { type: String, required: true },
    description: { type: String },
    active: Boolean
});

clasificationSchema.post('save', function(clasification, next) {

    //Actualizar Variable
    VariableModel.updateMany({ 'obj_Clasification._id': clasification._id }, { 'obj_Clasification': clasification }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

    //Actualizar Data
    DataModel.updateMany({ 'obj_Variable.obj_Clasification._id': clasification._id }, { 'obj_Variable.obj_Clasification': clasification }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

    //Actualizar Indicator
    IndicatorModel.updateMany({ 'obj_Clasification._id': clasification._id }, { 'obj_Clasification': clasification }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

});

module.exports = clasificationSchema;
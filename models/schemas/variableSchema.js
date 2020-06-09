const mongoose = require('mongoose');

const DataModel = require('../data');
const { charts } = require('../../const/charts');

var variableSchema = new mongoose.Schema({

    name: { type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    description: { type: String },
    type: { type: String, required: true },
    chart_type: { type: String, enum: { values: charts, message: "Tipo de gráfica desconocida." } },
    obj_Clasification: { type: Object, required: true },
    origins: [Object],

    code: { type: String },
    abbrevation: { type: String },
    periodicity: { type: String },
    measure: { type: String },
    measure_symbol: { type: String },
    label: { type: String },
    observations: { type: String },

    active: Boolean
});

variableSchema.post('save', function(variable, next) {

    //Actualizar Data
    DataModel.updateMany({ 'obj_Variable._id': variable._id }, { 'obj_Variable': variable }, { "multi": true },
        function(err, result) {
            if (err) {
                return next(err);
            }
            next();
        });

});

module.exports = variableSchema;
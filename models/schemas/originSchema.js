const mongoose = require('mongoose');

const DataModel = require('../data');
const VariableModel = require('../variable');

var originSchema = new mongoose.Schema({
    
    name: {type: String, required: true, minlength: [3, "El nombre debe contener al menos 3 caracteres."] },
    description: {type: String}
});

originSchema.post('save', function (origin, next) {    
    
    //Actualizar Variable
    VariableModel.updateMany(   { 'origins': { $elemMatch: { _id : origin._id } } },
                                { 
                                  $set: {"origins.$.name" : origin.name, 
                                         "origins.$.description" : origin.description}
                                }, 
                                {"multi": true},
                                function (err, result) {
                                        if (err) {
                                            return next(err);
                                        }
                                        next();
                                }
                            );
    
    //Actualizar Data
    DataModel.updateMany(   { 'obj_Variable.origins': { $elemMatch: { _id : origin._id } } },
                                { 
                                  $set: {"obj_Variable.origins.$.name" : origin.name, 
                                         "obj_Variable.origins.$.description" : origin.description}
                                }, 
                                {"multi": true},
                                function (err, result) {
                                        if (err) {
                                            return next(err);
                                        }
                                        next();
                                }
                        );

});

module.exports = originSchema;
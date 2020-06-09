const VariableModel = require('../models/variable');
const OriginModel = require('../models/origin');
const ClasificationModel = require('../models/clasification');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/variableValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

function addVariable(req, res) {
    const body = req.body;
    if (body) {

        //validate form with @hapi/joi
        const { error } = addValidation(body);
        if (error) {
            return responsesH.sendError(res, 400, messageErrorBody);
        }

        if (ObjectId.isValid(body.id_Clasification)) {

            ClasificationModel.findById({ _id: ObjectId(body.id_Clasification) }, async (err, clasification) => {
                if (err) 
                    return responsesH.sendError(res, 400, 'Temáticas no encontrada.'); 

                var array_origin = [];
                if (body.origins) {
                    for (i in body.origins ) {
                        const orig = body.origins[i];
                        if ( ObjectId.isValid(orig) ) {
                            array_origin.push( await OriginModel.findOne({ _id: orig }) );
                        }
                    }
                }

                const variable = new VariableModel({
                        name: body.name,
                        description: body.description,
                        type: body.type,
                        chart_type: body.chart_type,
                        obj_Clasification: clasification,
                        origins: array_origin,
                        active: true
                });

                variable.save((err, value) => {
                        if (err) {
                            return responsesH.sendError(res, 500, messageError);
                        }
        
                        return responsesH.sendResponseOk(res, value, 'Variable insertada correctamente.');
                });    
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


async function updateVariable(req, res) {
    const body = req.body;
    const _id = req.params.id;

    if (body && ObjectId.isValid(_id)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        //Search variable to update and update
        VariableModel.findById(_id, async (err, variable) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Variable no encontrada.');
            }
            //Update variable
            if (body.name) variable.name = body.name;
            if (body.description) variable.description = body.description;
            if (body.type) variable.type = body.type;
            if (body.chart_type) variable.chart_type = body.chart_type;

            if ( ObjectId.isValid( body.id_Clasification ) ) {
                const clasification = await ClasificationModel.findOne({_id: body.id_Clasification});
                if (clasification == null)
                    return responsesH.sendError(res, 400, 'Temáticas no encontrada.');
                variable.obj_Clasification = clasification ;
            } else {
                return responsesH.sendError(res, 400, 'Temáticas incorrecta.');
            }

            var array_origin = [];
            if (body.origins) {
                for (i in body.origins ) {
                    const orig = body.origins[i];
                    if ( ObjectId.isValid(orig) ) {
                        array_origin.push( await OriginModel.findOne({ _id: ObjectId(orig) }) );
                    }
                }

                variable.origins = array_origin;
            }

            variable.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la Variable.');
                }

                return responsesH.sendResponseOk(res, value, 'Variable actualizada correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function deleteVariable(req, res) {
    _id = req.params.id
    if (_id) {
        VariableModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando la Variable.');
            }

            return responsesH.sendResponseOk(res, value, 'Variable eliminada correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function getVariableByClasification(id_Clasification,req,res) {

    VariableModel.find({ 'obj_Clasification._id': ObjectId(id_Clasification) }, (err, value) => {
        if (err) {
            return responsesH.sendError(res, 500, messageError);
        }
        return responsesH.sendResponseOk(res, value);
    });
}

module.exports = {
    addVariable,
    updateVariable,
    deleteVariable,
    getVariableByClasification
}
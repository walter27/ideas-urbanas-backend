const IndicatorModel = require('../models/indicator');
const ClasificationModel = require('../models/clasification');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/indicatorValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

function addIndicator(req, res) {
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

                let len = body.configs.length;
                for (var i=1; i < len-1; i++)
                    if (body.configs[i][0] <= body.configs[i-1][0]) 
                        return responsesH.sendError(res, 400, 'Error en los datos.');  
                    
                const indicator = new IndicatorModel({
                        name: body.name,
                        description: body.description,
                        obj_Clasification: clasification,
                        configs: body.configs
                });

                indicator.save((err, value) => {
                        if (err) {
                            return responsesH.sendError(res, 500, messageError);
                        }
        
                        return responsesH.sendResponseOk(res, value, 'Indicador insertado correctamente.');
                });    
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


async function updateIndicator(req, res) {
    const body = req.body;
    const _id = req.params.id;

    if (body && ObjectId.isValid(_id)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        //Search indicator to update and update
        IndicatorModel.findById(_id, async (err, indicator) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Indicador no encontrado.');
            }

            let len = body.configs.length;
            for (var i=1; i < len-1; i++)
                if (body.configs[i][0] <= body.configs[i-1][0]) 
                    return responsesH.sendError(res, 400, 'Error en los datos.');  

            //Update indicator
            if (body.name) indicator.name = body.name;
            if (body.description) indicator.description = body.description;
            if (body.configs) indicator.configs = body.configs;

            if ( ObjectId.isValid( body.id_Clasification ) ) {
                const clasification = await ClasificationModel.findOne({_id: body.id_Clasification});
                if (clasification == null)
                    return responsesH.sendError(res, 400, 'Temáticas no encontrada.');
                indicator.obj_Clasification = clasification ;
            } else {
                return responsesH.sendError(res, 400, 'Temáticas incorrecta.');
            }

            indicator.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la Indicator.');
                }

                return responsesH.sendResponseOk(res, value, 'Indicador actualizado correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function deleteIndicator(req, res) {
    _id = req.params.id
    if (_id) {
        IndicatorModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando la Indicator.');
            }

            return responsesH.sendResponseOk(res, value, 'Indicador eliminado correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

module.exports = {
    addIndicator,
    updateIndicator,
    deleteIndicator
}
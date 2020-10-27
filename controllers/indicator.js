const IndicatorModel = require('../models/indicator');
const VariableModel = require('../models/variable');
const CantonModel = require('../models/canton');
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

        if (ObjectId.isValid(body.id_Variable) && ObjectId.isValid(body.id_Canton)) {

            VariableModel.findById({ _id: ObjectId(body.id_Variable) }, async(err, variable) => {
                if (err)
                    return responsesH.sendError(res, 400, 'Variable no encontrada.');

                CantonModel.findById({ _id: ObjectId(body.id_Canton) }, async(err, canton) => {
                    if (err)
                        return responsesH.sendError(res, 400, 'Canton no encontrado.');


                    const indicator = new IndicatorModel({
                        obj_Variable: variable,
                        obj_Canton: canton,
                        ridit: body.ridit,
                        year: body.year
                    });

                    indicator.save((err, value) => {
                        if (err) {
                            return responsesH.sendError(res, 500, messageError);
                        }

                        return responsesH.sendResponseOk(res, value, 'Indicador insertado correctamente.');
                    });
                })

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
        IndicatorModel.findById(_id, async(err, indicator) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Indicador no encontrado.');
            }


            //Update indicator
            if (body.ridit) indicator.ridit = body.ridit;
            if (body.year) indicator.year = body.year;

            if (ObjectId.isValid(body.id_Variable)) {
                const variable = await VariableModel.findOne({ _id: body.id_Variable });
                if (variable == null)
                    return responsesH.sendError(res, 400, 'Variable no encontrada.');
                indicator.obj_Variable = variable;
            } else {
                return responsesH.sendError(res, 400, 'Variable incorrecta.');
            }

            if (ObjectId.isValid(body.id_Canton)) {
                const canton = await CantonModel.findOne({ _id: body.id_Canton });
                if (canton == null)
                    return responsesH.sendError(res, 400, 'Canton no encontrado.');
                indicator.obj_Canton = canton;
            } else {
                return responsesH.sendError(res, 400, 'Canton incorrecto.');
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
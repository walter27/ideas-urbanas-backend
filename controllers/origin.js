const OriginModel = require('../models/origin');
var mongoose = require('mongoose');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/originValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function addOrigin(req, res) {
    const body = req.body;
    if (body) {

        //validate form with @hapi/joi
        const { error } = addValidation(body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        if (body.name && body.description) {

            const origin = new OriginModel({
                name: body.name || '',
                description: body.description || ''
            });
            origin.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, messageError);
                }

                return responsesH.sendResponseOk(res, value, 'Origen insertado correctamente.');
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


function updateOrigin(req, res) {
    const body = req.body;
    if (body) {
        const _id = req.params.id;

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        //Search Clasification to update and update
        OriginModel.findById(_id, (err, origin) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Origen no encontrado.');
            }

            //Update Origin
            if (body.name)        origin.name = body.name;
            if (body.description) origin.description = body.description;

            origin.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando el Origen.');
                }

                return responsesH.sendResponseOk(res, value, 'Origen actualizado correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function deleteOrigin(req, res) {
    _id = req.params.id
    if (_id) {
        OriginModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando lel Origen.');
            }

            return responsesH.sendResponseOk(res, value, 'Origen eliminado correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

module.exports = {
    addOrigin,
    updateOrigin,
    deleteOrigin
}
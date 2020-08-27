const ProvinciaModel = require('../models/provincia');
var mongoose = require('mongoose');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/provinciaValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'


function getProvincias(req, res) {

    const filters = filtersH.buildFilters(req);

    var extraFilters = {};

    if (req.body.search != null) {
        extraFilters = { $and: [] };
        extraFilters.$and.push({
            $or: [
                { 'name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
            ]
        });
    }

    if (req.params.id) {
        ProvinciaModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        ProvinciaModel.paginate(extraFilters, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

async function addProvincia(req, res) {
    const body = req.body;
    if (body) {

        //validate form with @hapi/joi
        const { error } = addValidation(body);
        if (error) {
            return responsesH.sendError(res, 400, messageErrorBody);
        }

        if (body.name) {

            const provincia = new ProvinciaModel({
                name: body.name || '',
                description: body.description || '',
                active: body.active
            });
            provincia.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, messageError);
                }

                return responsesH.sendResponseOk(res, value, 'Provincia insertada correctamente.');
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


function updateProvincia(req, res) {
    const body = req.body;
    if (body) {
        const _id = req.params.id;

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        //Search provincia to update and update
        ProvinciaModel.findById(_id, (err, provincia) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Provincia no encontrada.');
            }

            //Update provincia
            if (body.name) provincia.name = body.name;
            provincia.active = body.active;
            provincia.description = body.description || '';

            provincia.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la provincia.');
                }

                return responsesH.sendResponseOk(res, value, 'Provincia actualizada correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function deleteProvincia(req, res) {
    _id = req.params.id
    if (_id) {
        ProvinciaModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando la provincia.');
            }

            return responsesH.sendResponseOk(res, value, 'Provincia eliminada correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

module.exports = {
    getProvincias,
    addProvincia,
    updateProvincia,
    deleteProvincia
}
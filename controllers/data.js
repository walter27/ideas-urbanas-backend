const DataModel = require('../models/data');
const VariableModel = require('../models/variable');
const CantonModel = require('../models/canton');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/dataValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

function getDatas(req, res) {

    const filters = filtersH.buildFilters(req);

    var extraFilters = {};

    if (req.body.search != null) {
        extraFilters = { $and: [] };
        extraFilters.$and.push({
            $or: [
                { 'obj_Canton.name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
                { 'obj_Canton.obj_Provincia.name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
                { 'obj_Variable.name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
                { 'obj_Variable.obj_Clasification.name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
                //{ 'date': `${req.body.search}` },
                { 'obj_Variable.origins.name': { $all: [req.body.search] } }
            ]
        });
    }

    if (req.params.id) {
        DataModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {

        //console.log('EXTRA', extraFilters.$and[0]);
        DataModel.paginate(extraFilters, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function addData(req, res) {
    const body = req.body;

    if (body) {
        //validate form with @hapi/joi
        const { error } = addValidation(body);
        if (error) {
            return responsesH.sendError(res, 400, messageErrorBody);
        }
        if (ObjectId.isValid(body.id_Variable) && ObjectId.isValid(body.id_Canton)) {

            VariableModel.findById({ _id: ObjectId(body.id_Variable) }, (err, variable) => {
                if (err)
                    return responsesH.sendError(res, 400, 'Variable no encontrada.');

                CantonModel.findById({ _id: ObjectId(body.id_Canton) }, (err, canton) => {
                    if (err)
                        return responsesH.sendError(res, 400, 'Canton no encontrada.');

                    const data = new DataModel({
                        value: body.value,
                        description: body.description,
                        year: body.year,
                        obj_Variable: variable,
                        obj_Canton: canton,
                        active: true,
                        date: body.date
                    });

                    data.save((err, value) => {
                        if (err) {
                            return responsesH.sendError(res, 500, messageError, err);
                        }

                        return responsesH.sendResponseOk(res, value, 'Dato insertado correctamente.');
                    });

                });
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


async function updateData(req, res) {
    const body = req.body;
    const _id = req.params.id;

    if (body && ObjectId.isValid(_id)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        //Search data to update and update
        DataModel.findById(_id, async(err, data) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Dato no encontrado.');
            }

            //Update data
            if (body.value) data.value = body.value;
            if (body.description) data.description = body.description;
            if (body.year) data.year = body.year;
            if (body.date) data.date = body.date;


            if (ObjectId.isValid(body.id_Variable)) {
                const variable = await VariableModel.findOne({ _id: body.id_Variable });
                if (variable == null)
                    return responsesH.sendError(res, 400, 'Variable no encontrada.');
                data.obj_Variable = variable;
            } else {
                return responsesH.sendError(res, 400, 'Variable incorrecta.');
            }

            if (ObjectId.isValid(body.id_Canton)) {
                const canton = await CantonModel.findOne({ _id: body.id_Canton });
                if (canton == null)
                    return responsesH.sendError(res, 400, 'Canton no encontrada.');
                data.obj_Canton = canton;
            } else {
                return responsesH.sendError(res, 400, 'Canton incorrecta.');
            }

            data.save((err, data) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando el Dato.');
                }

                return responsesH.sendResponseOk(res, data, 'Dato actualizado correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function deleteData(req, res) {
    _id = req.params.id
    if (_id) {
        DataModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando el Dato.');
            }

            return responsesH.sendResponseOk(res, value, 'Dato eliminado correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}




module.exports = {
    getDatas,
    addData,
    updateData,
    deleteData
}
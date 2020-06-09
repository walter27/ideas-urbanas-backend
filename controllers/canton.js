const ProvinciaModel = require('../models/provincia');
const CantonModel = require('../models/canton');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/cantonValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

function getCantons(req, res) {

    const filters = filtersH.buildFilters(req);

    var extraFilters = { };

    if ( req.body.search != null ) {
        extraFilters = { $and: [] };
        extraFilters.$and.push({ $or: [ 
            { 'code': { $regex: '.*' + req.body.search + '.*' } },
            { 'name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
            { 'obj_Provincia.name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
        ]}); 
    }

    if (req.params.id) {
        CantonModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    } else {
        CantonModel.paginate(extraFilters, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function addCanton(req, res) {
    const body = req.body;
    if (body) {

        //validate form with @hapi/joi
        const { error } = addValidation(body);
        if (error) {
            console.log(error);
            return responsesH.sendError(res, 400, messageErrorBody);
        }

        if (body.name && body.code && ObjectId.isValid(body.id_Provincia)) {

            ProvinciaModel.findById({ _id: ObjectId(body.id_Provincia) }, (err, provincia) => {
                if (err) 
                    return responsesH.sendError(res, 400, 'Provincia no encontrada.');
                const canton = new CantonModel({
                        name: body.name || '',
                        description: body.description || '',
                        code: body.code || '',
                        obj_Provincia: provincia,
                        active: body.active,
                        url: body.url,
                        color: body.color || ''
                });

                canton.save((err, value) => {
                        if (err) {
                            return responsesH.sendError(res, 500, messageError);
                        }
        
                        return responsesH.sendResponseOk(res, value, 'Canton insertado correctamente.');
                });    
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


async function updateCanton(req, res) {
    const body = req.body;
    const _id = req.params.id;

    if (body && ObjectId.isValid(_id)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);
         
        console.log("Body: ",body);
            
        //Search canton to update and update
        CantonModel.findById(_id, async (err, canton) => {
            console.log("canton: ", canton)
            if (err) {
                return responsesH.sendError(res, 500, 'Canton no encontrado.');
            }
            //Update canton
            if (body.name) canton.name = body.name;
            if (body.description) canton.description = body.description;
            if (body.code) canton.code = body.code;
            canton.active = body.active;
            if (body.url) canton.url = body.url;
            if (body.color) canton.color = body.color;

            if ( ObjectId.isValid( body.id_Provincia ) ) {
                const provincia = await ProvinciaModel.findOne({_id: body.id_Provincia});
                if (provincia == null)
                    return responsesH.sendError(res, 400, 'Provincia no encontrada.');
                canton.obj_Provincia = provincia ;
            } else {
                return responsesH.sendError(res, 400, 'Provincia incorrecta.');
            }

            canton.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando el Canton.');
                }

                return responsesH.sendResponseOk(res, value, 'Canton actualizado correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function deleteCanton(req, res) {
    _id = req.params.id
    if (_id) {
        CantonModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando el Canton.');
            }

            return responsesH.sendResponseOk(res, value, 'Canton eliminado correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

module.exports = {
    getCantons,
    addCanton,
    updateCanton,
    deleteCanton
}
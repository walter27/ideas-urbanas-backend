const TagModel = require('../models/tag');
const CantonModel = require('../models/canton');
const StopwordModel = require('../models/stopwords');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/tagValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function addTag(req, res) {
    var data = { text: null, id_Canton: null, type: null };
    if (req.body) {
        data.text = req.body.text;
        data.id_Canton = req.body.id_Canton;
        data.type = req.body.type;
    }

    if (req.body && ObjectId.isValid(data.id_Canton)) {

        //validate form with @hapi/joi
        const { error } = addValidation(data);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        CantonModel.findById({ _id: ObjectId(data.id_Canton) }, (err, canton) => {
            if (err)
                return responsesH.sendError(res, 400, 'Canton no encontrado.');

            const tag = new TagModel({
                text: data.text,
                obj_Canton: canton,
                type: data.type
            });

            tag.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, messageError);
                }
                return responsesH.sendResponseOk(res, value, 'Tag insertada correctamente.');
            });
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

async function deleteTag(req, res) {
    _id = req.params.id
    if (ObjectId.isValid(_id)) {

        const tag = await TagModel.findOne({ _id: _id });
        if (research == null)
            return responsesH.sendError(res, 500, 'Research no encontrada.');

        TagModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando la Research.');
            }

            return responsesH.sendResponseOk(res, value, 'Tag eliminada correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function getTags(req, res) {
    const filters = filtersH.buildFilters(req);

    var extraFilters = {};

    if (req.body.search != null) {
        extraFilters = { $and: [] };
        extraFilters.$and.push({
            $or: [
                { 'text': { $regex: '.*' + req.body.search + '.*' } },
                { 'obj_Canton.name': { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
            ]
        });
    }

    TagModel.paginate(extraFilters, filters, (err, value) => {
        if (err) {
            return responsesH.sendError(res, 500, messageError);
        }
        return responsesH.sendResponseOk(res, value);
    });
}


function getTagsByCantByType(req, res) {

    const id_Canton = req.body.id_Canton;
    const type = req.body.type || 'all'

    if (ObjectId.isValid(id_Canton)) {
        var search = { 'obj_Canton._id': ObjectId(id_Canton) };

        if (type != 'all')
            search.type = type;

        TagModel.aggregate([
            {
                $match: search
            },
            {
                $group: {
                    _id: '$text',
                    count: { $sum: 1 }
                }
            }
        ], (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });

    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function getStopwords(req, res) {
    StopwordModel.find((err, value) => {
        if (err) {
            return responsesH.sendError(res, 500, messageError);
        }
        return responsesH.sendResponseOk(res, value);
    });
}

module.exports = {
    addTag,
    deleteTag,
    getTagsByCantByType,
    getStopwords,
    getTags
}
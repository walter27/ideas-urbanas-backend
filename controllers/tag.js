const TagModel = require('../models/tag');
const CantonModel = require('../models/canton');
const StopwordModel = require('../models/stopwords');
const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmerEs
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/tagValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function addTag(req, res) {
    let data = { text: null, id_Canton: null, type: null };
    if (req.body) {
        data.text = req.body.text;
        data.id_Canton = req.body.id_Canton;
        //data.type = req.body.type;

        const analyzer = new Analyzer('Spanish', stemmer, 'senticon');
        let value = analyzer.getSentiment([data.text]);
        if (value > 0) {
            data.type = 'positive'

        }

        if (value === 0) {
            data.type = 'neutro'

        }

        if (value < 0) {

            data.type = 'negative'


        }

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


async function updateTag(req, res) {
    const body = req.body;
    const _id = req.params.id;

    if (body && ObjectId.isValid(_id)) {
        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
        //console.log(error);

            return responsesH.sendError(res, 400, messageErrorBody);
        //Search canton to update and update
        TagModel.findById(_id, async(err, tag) => {
            //console.log("canton: ", canton)
            if (err) {
                return responsesH.sendError(res, 500, 'Palabra no encontrado.');
            }
            //Update tag

            if (body.text) tag.text = body.text;
            if (body.type) tag.type = body.type;

            if (ObjectId.isValid(body.id_Canton)) {
                const canton = await CantonModel.findOne({ _id: body.id_Canton });
                if (canton == null)
                    return responsesH.sendError(res, 400, 'Canton no encontrada.');
                tag.obj_Canton = canton;
            } else {
                return responsesH.sendError(res, 400, 'Canton incorrecto.');
            }

            tag.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la palabra.');
                }

                return responsesH.sendResponseOk(res, value, 'Palabra actualizado correctamente.');
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
        if (tag == null)
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
                { 'type': { $regex: '.*' + req.body.search + '.*' } },
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

        TagModel.aggregate([{
                $match: search
            },
            {
                $group: {
                    _id: '$text',
                    //count: { $sum: 1 },
                    positive: { $sum: { $cond: [{ $eq: ['$type', 'positive'] }, 1, 0] } },
                    negative: { $sum: { $cond: [{ $eq: ['$type', 'negative'] }, 1, 0] } },
                    neutro: { $sum: { $cond: [{ $eq: ['$type', 'neutro'] }, 1, 0] } }
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

function updateStopWords(req, res) {

    let body = req.body;
    let id = req.params.id

    if (body && ObjectId.isValid(id)) {

        StopwordModel.findById(id, (error, data) => {

            if (error) {
                return responsesH.sendError(res, 500, 'Lista de palabras no encontrada.');
            }

            data.stopwords = body;
            data.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la  lista de palabras.');
                }

                return responsesH.sendResponseOk(res, value, 'Lista de palabras actualizada correctamente.');
            });

        })



    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }

    /*const stopword = new StopwordModel({
        stopwords: body
    });

    stopword.save((err, value) => {
        if (err) {
            return responsesH.sendError(res, 500, messageError);
        }
        return responsesH.sendResponseOk(res, value, 'Palabras prohibidas actulizadas');
    });*/


}
module.exports = {
    addTag,
    deleteTag,
    updateTag,
    getTagsByCantByType,
    getStopwords,
    getTags,
    updateStopWords
}
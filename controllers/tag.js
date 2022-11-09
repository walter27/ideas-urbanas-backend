const TagModel = require('../models/tag');
const WordModel = require('../models/word');
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
    let data = { id_Canton: null, id_Word: null };
    if (req.body) {
        data.id_Canton = req.body.id_Canton;
        data.id_Word = req.body.id_Word;

    }

    if (req.body && ObjectId.isValid(data.id_Canton) && ObjectId.isValid(data.id_Word)) {

        //validate form with @hapi/joi
        const { error } = addValidation(data);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        CantonModel.findById({ _id: ObjectId(data.id_Canton) }, (err, canton) => {
            if (err)
                return responsesH.sendError(res, 400, 'Canton no encontrado.');

            WordModel.findById({ _id: ObjectId(data.id_Word) }, (err, word) => {
                if (err)
                    return responsesH.sendError(res, 400, 'Palabra no encontrado.');

                const tag = new TagModel({
                    obj_Canton: canton,
                    obj_Word: word
                });

                tag.save((err, value) => {
                    if (err) {
                        return responsesH.sendError(res, 500, messageError);
                    }
                    return responsesH.sendResponseOk(res, value, 'Tag insertada correctamente.');
                });

            })
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
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
                    _id: '$obj_Word.text',
                    //count: { $sum: 1 },
                    positive: { $sum: { $cond: [{ $eq: ['$obj_Word.type', 'positive'] }, 1, 0] } },
                    negative: { $sum: { $cond: [{ $eq: ['$obj_Word.type', 'negative'] }, 1, 0] } },
                    neutro: { $sum: { $cond: [{ $eq: ['$obj_Word.type', 'neutro'] }, 1, 0] } }
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
    getTagsByCantByType,
    getStopwords,
    updateStopWords
}
const WordModel = require('../models/word');
const TagModel = require('../models/tag');
const CantonModel = require('../models/canton');


var ObjectId = require('mongoose').Types.ObjectId;

const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmerEs
const fs = require('fs');


const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/wordValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function addWord(req, res) {
    let data = { text: null, type: null };
    if (req.body) {
        data.text = req.body.text.replace(/[,-.-;]/g, "");
        data.type = req.body.type;


        const word = await WordModel.findOne({ text: data.text });

        if (word === null) {

            if (!data.type) {

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


            //validate form with @hapi/joi
            const { error } = addValidation(data);
            if (error)
                return responsesH.sendError(res, 400, messageErrorBody);


            const word = new WordModel({
                text: data.text,
                type: data.type
            });

            word.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, messageError);
                }
                return responsesH.sendResponseOk(res, value, 'Palabra insertada correctamente.');
            });
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


async function updateWord(req, res) {
    const body = req.body;
    const _id = req.params.id;

    if (body && ObjectId.isValid(_id)) {
        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
        //console.log(error);

            return responsesH.sendError(res, 400, messageErrorBody);
        //Search canton to update and update
        WordModel.findById(_id, async(err, word) => {
            //console.log("canton: ", canton)
            if (err) {
                return responsesH.sendError(res, 500, 'Palabra no encontrado.');
            }
            //Update word

            if (body.text) word.text = body.text;
            if (body.type) word.type = body.type;



            word.save((err, value) => {
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

async function deleteWord(req, res) {
    _id = req.params.id
    if (ObjectId.isValid(_id)) {

        const word = await WordModel.findOne({ _id: _id });
        if (word == null)
            return responsesH.sendError(res, 500, 'Palabra no encontrada.');

        WordModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error al eliminar palabra.');
            }


            TagModel.deleteMany({ 'obj_Word._id': ObjectId(_id) }, (err, word) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error al eliminar palabra.');
                }
            });

            return responsesH.sendResponseOk(res, value, 'Palabra eliminada correctamente.');
        });




    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function getWords(req, res) {
    const filters = filtersH.buildFilters(req);

    var extraFilters = {};

    if (req.body.search != null) {
        extraFilters = { $and: [] };
        extraFilters.$and.push({
            $or: [
                { 'text': { $regex: '.*' + req.body.search + '.*' } },
                { 'type': { $regex: '.*' + req.body.search + '.*' } },
            ]
        });
    }

    WordModel.paginate(extraFilters, filters, (err, value) => {
        if (err) {
            return responsesH.sendError(res, 500, messageError);
        }
        return responsesH.sendResponseOk(res, value);
    });
}

async function getWord(req, res) {

    const text = req.body.text.replace(/[,-.-;]/g, "");

    if (text) {

        const word = await WordModel.findOne({ text: text });

        if (word === null) {

            return responsesH.sendError(res, 500, 'Palabra no encontrada.');

        } else {


            return responsesH.sendResponseOk(res, word, 'Palabra encontrada.');


        }


    } else {

        return responsesH.sendError(res, 500, messageErrorBody);

    }



}

async function loadWordsJSON(req, res) {

    var words_file = fs.readFileSync(req.files.words.path);
    var words_json = JSON.parse(words_file);

    for (let i = 0; i < words_json.length; i++) {


        let data = { text: null, type: null };
        data.text = words_json[i].palabra.replace(/[,-.-;]/g, "");
        await WordModel.findOne({ text: data.text }, async(err, wordDB) => {

            if (err) {
                return console.log(err);
            }

            if (wordDB === null) {

                if (!data.type) {

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

                //validate form with @hapi/joi
                const { error } = addValidation(data);
                if (error)
                    console.log('errorVALIDATION', err);

                //return responsesH.sendError(res, 400, messageErrorBody);

                const word = new WordModel({
                    text: data.text,
                    type: data.type
                });

                word.save(async(err, value) => {
                    if (err) {
                        console.log('errordatabase', err);
                        //return responsesH.sendError(res, 500, messageError);
                    }
                    // return await responsesH.sendResponseOk(res, value, 'Palabra insertada correctamente.');

                });
            }

        });



    }

    return await res.status(201).json({
        ok: true,
        message: 'Datos ingresados correctamente'

    });

}


async function loadTagsJSON(req, res) {

    var words_file = fs.readFileSync(req.files.tags.path);
    var words_json = JSON.parse(words_file);

    //console.log(words_json.length);

    for (let i = 0; i < words_json.length; i++) {

        let data = { id_Canton: null, text: null };

        data.text = words_json[i].palabra.replace(/[,-.-;]/g, "");


        await CantonModel.findOne({ code: words_json[i].codigo_canton }, (err, canton) => {
            if (err) {
                console.log('data base canton ', err);

            }
            //return responsesH.sendError(res, 400, 'Canton no encontrado.');

            WordModel.findOne({ text: data.text }, async(err, wordDB) => {

                const tag = new TagModel({
                    obj_Canton: canton,
                    obj_Word: wordDB
                });

                tag.save(async(err, value) => {
                    if (err) {
                        console.log('data base tag', err);
                        //return responsesH.sendError(res, 500, messageError);
                    }
                    //return await responsesH.sendResponseOk(res, value, 'Tag insertada correctamente.');
                });



            })


        })


    }

    return await res.status(201).json({
        ok: true,
        message: 'Datos ingresados correctamente'

    });



}

async function deleteTagWordJSON(req, res) {

    var words_file = fs.readFileSync(req.files.tags.path);
    var words_json = JSON.parse(words_file);

    let sizeJson = words_json.length;

    for (let i = 0; i < words_json.length; i++) {

        let validate = await validateUpperCase(words_json[i].text);
        if (!validate) {

            await WordModel.deleteOne({ text: words_json[i].text }, (err, value) => {
                if (err) {

                    console.log('Error al eliminar palabra');
                    //return responsesH.sendError(res, 500, 'Error al eliminar palabra.');


                }
            })

            await TagModel.deleteMany({ 'obj_Word.text': words_json[i].text }, (err, word) => {
                if (err) {

                    console.log('Error al eliminar palabra tag');
                    //return responsesH.sendError(res, 500, 'Error al eliminar palabra.');
                }
            });

        }

    }

    return await res.status(201).json({
        ok: true,
        message: 'Datos eliminados correctamente'

    });




    /*for (let i = 0; i < ; i++) {


        let count = 0;
        let size = 0;

        size = words_json[i].text.length


        for (let j = 0; j < size; i++) {

            if (words_json[i].text[j] !== undefined) {
                console.log(i);

            }
            /*if (words_json[i].text[j] === words_json[i].text[j].toUpperCase()) {
                count = count + 1;
            }

        }

        /*if (count > 0) {
            console.log(words_json[i].text);
        }*/



    /*if (ObjectId.isValid(_id)) {

            if (word == null)
                return responsesH.sendError(res, 500, 'Palabra no encontrada.');

         await WordModel.deleteOne({ _id: _id }, (err, value) => {
                if (err) {

                    console.log('Error al eliminar palabra);
                    //return responsesH.sendError(res, 500, 'Error al eliminar palabra.');
                }


                TagModel.deleteMany({ 'obj_Word._id': ObjectId(_id) }, (err, word) => {
                    if (err) {

                        console.log('Error al eliminar palabra tag');
                        //return responsesH.sendError(res, 500, 'Error al eliminar palabra.');
                    }
                });
                

                //return responsesH.sendResponseOk(res, value, 'Palabra eliminada correctamente.');
            });




        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }

    }*/

}

function validateUpperCase(string) {

    let count = 0;
    for (let i = 0; i < string.length; i++) {

        if (string[i] === string[i].toUpperCase()) {
            count = count + 1;
        }
    }

    if (count === 1 || count === 0) {
        return true;
    } else {
        return false;
    }

}


module.exports = {
    addWord,
    deleteWord,
    updateWord,
    getWords,
    getWord,
    loadWordsJSON,
    loadTagsJSON,
    deleteTagWordJSON
}
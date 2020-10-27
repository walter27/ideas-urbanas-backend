const ResearchModel = require('../models/research');
const CantonModel = require('../models/canton');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const fs = require('fs');
const crypto = require('crypto');
var archiver = require('archiver');

const { addValidation, updateValidation } = require('../validation/researchValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function addResearch(req, res) {

    var data = { title: null, author: null, year: null, link: null, category: null, id_Canton: null };
    if (req.fields) {
        data.title = req.fields.title;
        data.author = req.fields.author;
        data.year = req.fields.year;
        data.link = req.fields.link;
        data.category = req.fields.category;
        data.id_Canton = req.fields.id_Canton;
    }

    if (req.fields && req.files && ObjectId.isValid(data.id_Canton)) {

        //validate form with @hapi/joi
        const { error } = addValidation(data);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        CantonModel.findById({ _id: ObjectId(data.id_Canton) }, (err, canton) => {
            if (err)
                return responsesH.sendError(res, 400, 'Canton no encontrado.');


            /*  //Upload File to the Server
              const id_script = crypto.randomBytes(20).toString('hex');
              var route = './images/' + id_script + '__' + req.files.image.name;
              var tmp_path = req.files.image.path;

              var readStream = fs.createReadStream(tmp_path);
              var writeStream = fs.createWriteStream(route);

              readStream.pipe(writeStream);*/

            const research = new ResearchModel({
                title: req.fields.title,
                author: req.fields.author,
                year: req.fields.year,
                link: req.fields.link,
                category: req.fields.category,
                //image_route: route,
                //image_contentType: req.files.image.type,
                obj_Canton: canton,
                active: true
            });

            research.save((err, value) => {
                if (err) {
                    /* try {
                         fs.unlinkSync(route);
                     } catch (err) {

                     }*/
                    return responsesH.sendError(res, 500, messageError);
                }
                return responsesH.sendResponseOk(res, value, 'Research insertada correctamente.');
            });

            /*try {
                fs.unlinkSync(tmp_path);
            } catch (err) {

            }*/
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

async function updateResearch(req, res) {

    var data = { title: null, author: null, year: null, link: null, category: null, id_Canton: null };
    if (req.fields) {
        data.title = req.fields.title;
        data.author = req.fields.author;
        data.year = req.fields.year;
        data.link = req.fields.link;
        data.category = req.fields.category;
        data.id_Canton = req.fields.id_Canton;
        //data.active = req.fields.active

    }

    if (req.fields && req.files && ObjectId.isValid(data.id_Canton)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(data);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        CantonModel.findById({ _id: ObjectId(data.id_Canton) }, (err, canton) => {
            if (err)
                return responsesH.sendError(res, 400, 'Canton no encontrado.');

            const _id = req.params.id;
            //Search Research to update and update
            ResearchModel.findById(_id, (err, research) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Research no encontrada.');
                }

                var route_to_delete = research.image_route;

                //Update Clasification
                if (req.fields.title) research.title = req.fields.title;
                if (req.fields.author) research.author = req.fields.author;
                if (req.fields.year) research.year = req.fields.year;
                if (req.fields.link) research.link = req.fields.link;
                if (req.fields.category) research.category = req.fields.category;
                if (req.fields.id_Canton) research.canton = canton;
                if (req.fields.active) research.active = req.fields.active;


                if (req.files.image) {


                    //Upload File to the Server
                    const id_script = crypto.randomBytes(20).toString('hex');
                    var route = './images/' + id_script + '__' + req.files.image.name;
                    var tmp_path = req.files.image.path;

                    var readStream = fs.createReadStream(tmp_path);
                    var writeStream = fs.createWriteStream(route);

                    readStream.pipe(writeStream);

                    research.image_route = route;
                    research.image_contentType = req.files.image.type;
                }
                research.save((err, value) => {
                    if (err) {
                        return responsesH.sendError(res, 500, 'Error actualizando la Investigación.');
                    }
                    return responsesH.sendResponseOk(res, value, 'Investigación actualizada correctamente.');
                });

                // Delete temporary file
                try {
                    if (fs.existsSync(tmp_path)) {
                        fs.unlinkSync(tmp_path);

                    }
                    if (fs.existsSync(route_to_delete)) {
                        fs.unlinkSync(route_to_delete);

                    }
                } catch (err) {

                }

            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

async function deleteResearch(req, res) {
    _id = req.params.id
    if (ObjectId.isValid(_id)) {

        const research = await ResearchModel.findOne({ _id: _id });
        if (research == null)
            return responsesH.sendError(res, 500, 'Research no encontrada.');

        ResearchModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando la Research.');
            }
            return responsesH.sendResponseOk(res, value, 'Research eliminada correctamente.');
        });

        //Delete the temporary file
        try {
            fs.unlinkSync(research.image_route);
        } catch (err) {

        }

    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function getResearchsByCatAndCant(req, res) {

    const id_Canton = req.body.id_Canton;
    const category = req.body.category;
    const sort = { year: -1 };


    if (ObjectId.isValid(id_Canton)) {
        var search = { 'obj_Canton._id': ObjectId(id_Canton) };

        if (category) {
            search.category = category;
        }

        ResearchModel.find(search, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        }).sort(sort);
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }


}

module.exports = {
    addResearch,
    updateResearch,
    deleteResearch,
    getResearchsByCatAndCant
}
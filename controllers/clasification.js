const ClasificationModel = require('../models/clasification');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const fs = require('fs');
const crypto = require('crypto');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/clasificationValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function addClasification(req, res) {
    
    var data = {name: null, description: null};
    if (req.fields) {
        data.name  = req.fields.name;
        data.description  = req.fields.description;
    }

    if (req.fields && req.files) {

        //validate form with @hapi/joi
        const { error } = addValidation(data);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

            //Upload File Normal to the Server
            var id_script = crypto.randomBytes(20).toString('hex');
            var route = './images/' + id_script + '__' + req.files.image.name;
            var tmp_path = req.files.image.path;

            var readStream = fs.createReadStream(tmp_path);
            var writeStream = fs.createWriteStream(route);

            readStream.pipe(writeStream);

            //Upload File Active to the Server
            id_script = crypto.randomBytes(20).toString('hex');
            var route_active = './images/' + id_script + '__' + req.files.image_active.name;
            var tmp_path_active = req.files.image_active.path;

            var readStream = fs.createReadStream(tmp_path_active);
            var writeStream = fs.createWriteStream(route_active);

            readStream.pipe(writeStream);

            const clasification = new ClasificationModel({
                name: req.fields.name,
                description: req.fields.description,
                image_route: route,
                image_contentType: req.files.image.type,
                image_active_route: route_active,
                image_active_contentType: req.files.image_active.type
            });

            clasification.save((err, value) => {
                if (err) {
                    try {
                        fs.unlinkSync(route);
                        fs.unlinkSync(route_active);
                    } catch(err) {
                
                    }
                    return responsesH.sendError(res, 500, messageError);
                }

                return responsesH.sendResponseOk(res, value, 'Clasification insertada correctamente.');
            });

            try {
                fs.unlinkSync(tmp_path);
                fs.unlinkSync(tmp_path_active);
              } catch(err) {
                
            }

    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


function updateClasification(req, res) {
    var data = {name: null, description: null};
    if (req.fields) {
        data.name  = req.fields.name;
        data.description  = req.fields.description;
    }
    const _id = req.params.id;

    if (req.fields && req.files && ObjectId.isValid(_id)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(data);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        //Search Clasification to update and update
        ClasificationModel.findById(_id, (err, clasification) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Clasificacion no encontrada.');
            }

            var route_to_delete = clasification.image_route;
            var route_to_delete_active = clasification.image_active_route;

            //Update Clasification
            if (req.fields.name)        clasification.name = req.fields.name;
            if (req.fields.description) clasification.description = req.fields.description;

            if (req.files.image) {

                //Upload File Normal to the Server
                var id_script = crypto.randomBytes(20).toString('hex');
                var route = './images/' + id_script + '__' + req.files.image.name;
                var tmp_path = req.files.image.path;

                var readStream = fs.createReadStream(tmp_path);
                var writeStream = fs.createWriteStream(route);

                readStream.pipe(writeStream);

                clasification.image_route = route;
                clasification.image_contentType = req.files.image.type;
            }

            if (req.files.image_active) {
                //Upload File Active to the Server
                var id_script = crypto.randomBytes(20).toString('hex');
                var route_active = './images/' + id_script + '__' + req.files.image_active.name;
                var tmp_path_active = req.files.image_active.path;

                var readStream = fs.createReadStream(tmp_path_active);
                var writeStream = fs.createWriteStream(route_active);

                readStream.pipe(writeStream);

                clasification.image_active_route = route_active;
                clasification.image_active_contentType = req.files.image_active.type;
            }

            clasification.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la Clasification.');
                }

                return responsesH.sendResponseOk(res, value, 'Clasification actualizada correctamente.');
            });

            
            try {
                fs.unlinkSync(tmp_path);
                fs.unlinkSync(tmp_path_active);
                fs.unlinkSync(route_to_delete);
                fs.unlinkSync(route_to_delete_active);
              } catch(err) {
                
            }

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

async function deleteClasification(req, res) {
    _id = req.params.id
    if (_id) {
        const clasification = await ClasificationModel.findOne({_id: _id});
        if (clasification == null) 
            return responsesH.sendError(res, 500, 'Clasification no encontrada.');

        ClasificationModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando la Clasification.');
            }

            return responsesH.sendResponseOk(res, value, 'Clasification eliminada correctamente.');
        });

        try {
            fs.unlinkSync(clasification.image_route);
            fs.unlinkSync(clasification.image_active_route);
          } catch(err) {
            
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

module.exports = {
    addClasification,
    updateClasification,
    deleteClasification
}
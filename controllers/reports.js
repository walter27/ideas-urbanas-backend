const ReportsModel = require('../models/reports');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const fs = require('fs');
const crypto = require('crypto');
var archiver = require('archiver');

const { addValidation, updateValidation } = require('../validation/reportsValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function addReports(req, res) {

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

                //Upload File to the Server
                const id_script = crypto.randomBytes(20).toString('hex');
                var route = './images/' + id_script + '__' + req.files.image.name;
                var tmp_path = req.files.image.path;

                var readStream = fs.createReadStream(tmp_path);
                var writeStream = fs.createWriteStream(route);

                readStream.pipe(writeStream);

                fs.unlinkSync(tmp_path);                                   

                const reports = new ReportsModel({
                    name: req.fields.name,
                    description: req.fields.description,
                    image_route: route,
                    image_contentType: req.files.image.type,
                    active: true
                });

                reports.save((err, value) => {
                        if (err) {
                            fs.unlink(route, function(err) {
                                if (err)
                                    throw err;
                            });
                            return responsesH.sendError(res, 500, messageError);
                        }
                        return responsesH.sendResponseOk(res, value, 'Reporte insertado correctamente.');
                });   
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

async function deleteReports(req, res) {
    _id = req.params.id
    if ( ObjectId.isValid( _id ) ) {

        const reports = await ReportsModel.findOne({_id: _id});
        if (reports == null) 
            return responsesH.sendError(res, 500, 'Reporte no encontrado.');

        ReportsModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando el Reporte.');
            }

            // Delete the temporary file
            fs.unlink(reports.image_route, function(err) {
                if (err) 
                    throw err;
            });

            return responsesH.sendResponseOk(res, value, 'Reporte eliminado correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

module.exports = {
    addReports,
    deleteReports
}
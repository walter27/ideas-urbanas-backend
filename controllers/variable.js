const VariableModel = require('../models/variable');
const OriginModel = require('../models/origin');
const ClasificationModel = require('../models/clasification');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const fs = require('fs');
const crypto = require('crypto');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation } = require('../validation/variableValidation');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

function addVariable(req, res) {

    var data = { name: null, description: null, type: null, chart_type: null, id_Clasification: null, origins: null, active: null, is_indice: null, values_indice: null }
    if (req.fields) {

        data.name = req.fields.name;
        data.description = req.fields.description;
        data.type = req.fields.type;
        data.chart_type = req.fields.chart_type;
        data.id_Clasification = req.fields.id_Clasification;
        data.origins = req.fields.id_origins;
        data.active = req.fields.active;
        data.is_indice = req.fields.is_indice;
        data.values_indice = req.fields.values_indice;
    }


    if (req.fields && req.files && ObjectId.isValid(data.id_Clasification)) {

        //validate form with @hapi/joi
        const { error } = addValidation(data);
        if (error) {
            console.log('eror', error);
            return responsesH.sendError(res, 400, messageErrorBody);
        }

        //Upload File to the Server
        const id_script = crypto.randomBytes(20).toString('hex');
        var route = './images/' + id_script + '__' + req.files.image.name;
        var tmp_path = req.files.image.path;

        var readStream = fs.createReadStream(tmp_path);
        var writeStream = fs.createWriteStream(route);

        readStream.pipe(writeStream);

        fs.unlinkSync(tmp_path);

        ClasificationModel.findById({ _id: ObjectId(data.id_Clasification) }, async(err, clasification) => {
            if (err) {
                console.log('ERROR Clasification', err);
                return responsesH.sendError(res, 400, 'Temáticas no encontrada.');
            }

            var array_origin = [];
            if (data.origins) {
                if (ObjectId.isValid(data.origins)) {
                    array_origin.push(await OriginModel.findOne({ _id: ObjectId(data.origins) }));
                }
            }


            let values_indice = [];
            let values_indiceJSON = JSON.parse(req.fields.values_indice);
            if (values_indiceJSON) {
                values_indiceJSON.forEach(value => {

                    values_indice.push(value)

                });
            }




            const variable = new VariableModel({
                name: req.fields.name,
                description: req.fields.description,
                type: req.fields.type,
                chart_type: req.fields.chart_type,
                obj_Clasification: clasification,
                origins: array_origin,
                active: req.fields.active,
                is_indice: req.fields.is_indice,
                values_indice: values_indice,
                image_route: route,
                image_contentType: req.files.image.type,

            });

            variable.save((err, value) => {
                if (err) {
                    fs.unlink(route, function(err) {
                        if (err)
                            throw err;
                    });
                    return responsesH.sendError(res, 500, messageError);
                }

                return responsesH.sendResponseOk(res, value, 'Variable insertada correctamente.');
            });



        });



    } else {
        console.log('EROR');
        return responsesH.sendError(res, 500, messageErrorBody);
    }




    /*const body = req.body;
    if (body) {

        //validate form with @hapi/joi
        const { error } = addValidation(body);
        if (error) {
            return responsesH.sendError(res, 400, messageErrorBody);
        }

        if (ObjectId.isValid(body.id_Clasification)) {

            ClasificationModel.findById({ _id: ObjectId(body.id_Clasification) }, async(err, clasification) => {
                if (err)
                    return responsesH.sendError(res, 400, 'Temáticas no encontrada.');

                var array_origin = [];
                if (body.origins) {
                    for (i in body.origins) {
                        const orig = body.origins[i];
                        if (ObjectId.isValid(orig)) {
                            array_origin.push(await OriginModel.findOne({ _id: orig }));
                        }
                    }
                }

                const variable = new VariableModel({
                    name: body.name,
                    description: body.description,
                    type: body.type,
                    chart_type: body.chart_type,
                    obj_Clasification: clasification,
                    origins: array_origin,
                    active: body.active,
                    is_indice: body.is_indice,
                    values_indice: body.values_indice

                });

                variable.save((err, value) => {
                    if (err) {
                        return responsesH.sendError(res, 500, messageError);
                    }

                    return responsesH.sendResponseOk(res, value, 'Variable insertada correctamente.');
                });
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }*/
}


async function updateVariable(req, res) {



    var data = { name: null, description: null, type: null, chart_type: null, id_Clasification: null, origins: null, active: null, is_indice: null, values_indice: null }
    if (req.fields) {

        data.name = req.fields.name;
        data.description = req.fields.description;
        data.type = req.fields.type;
        data.chart_type = req.fields.chart_type;
        data.id_Clasification = req.fields.id_Clasification;
        data.origins = req.fields.origins;
        data.active = req.fields.active;
        data.is_indice = req.fields.is_indice;
        data.values_indice = req.fields.values_indice;
    }

    const _id = req.params.id;

    if (req.fields && req.files && ObjectId.isValid(data.id_Clasification)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(data);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);


        VariableModel.findById(_id, async(err, variable) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Variable no encontrada.');
            }

            let values_indice = [];
            let values_indiceJSON = JSON.parse(req.fields.values_indice);
            if (values_indiceJSON) {
                values_indiceJSON.forEach(value => {

                    values_indice.push(value)

                });
            }





            var array_origin = [];
            if (data.origins) {
                if (ObjectId.isValid(data.origins)) {
                    array_origin.push(await OriginModel.findOne({ _id: ObjectId(data.origins) }));
                }

                variable.origins = array_origin;
            }




            //Update variable
            if (req.fields.name) variable.name = req.fields.name;
            if (req.fields.description) variable.description = req.fields.description;
            if (req.fields.type) variable.type = req.fields.type;
            if (req.fields.chart_type) variable.chart_type = req.fields.chart_type;
            if (req.fields.values_indice) variable.values_indice = values_indice;
            if (req.fields.active) variable.active = req.fields.active;
            if (req.fields.is_indice) variable.is_indice = req.fields.is_indice;

            if (req.files.image) {

                var route_to_delete = variable.image_route;

                //Upload File Normal to the Server
                var id_script = crypto.randomBytes(20).toString('hex');
                var route = './images/' + id_script + '__' + req.files.image.name;
                var tmp_path = req.files.image.path;

                var readStream = fs.createReadStream(tmp_path);
                var writeStream = fs.createWriteStream(route);

                readStream.pipe(writeStream);

                variable.image_route = route;
                variable.image_contentType = req.files.image.type;
            }

            variable.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la Variable.');
                }

                return responsesH.sendResponseOk(res, value, 'Variable actualizada correctamente.');
            });

            try {

                if (fs.existsSync(tmp_path)) {
                    fs.unlinkSync(tmp_path);

                }
                if (fs.existsSync(route_to_delete)) {
                    fs.unlinkSync(route_to_delete);

                }
            } catch (err) {

                console.log(err);

            }

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }


    /*const body = req.body;
    const _id = req.params.id;

    if (body && ObjectId.isValid(_id)) {

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        //Search variable to update and update
        VariableModel.findById(_id, async(err, variable) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Variable no encontrada.');
            }
            //Update variable
            if (body.name) variable.name = body.name;
            if (body.description) variable.description = body.description;
            if (body.type) variable.type = body.type;
            if (body.chart_type) variable.chart_type = body.chart_type;
            variable.active = body.active;
            variable.is_indice = body.is_indice;
            if (body.values_indice) variable.values_indice = body.values_indice;


            if (ObjectId.isValid(body.id_Clasification)) {
                const clasification = await ClasificationModel.findOne({ _id: body.id_Clasification });
                if (clasification == null)
                    return responsesH.sendError(res, 400, 'Temáticas no encontrada.');
                variable.obj_Clasification = clasification;
            } else {
                return responsesH.sendError(res, 400, 'Temáticas incorrecta.');
            }

            var array_origin = [];
            if (body.origins) {
                for (i in body.origins) {
                    const orig = body.origins[i];
                    if (ObjectId.isValid(orig)) {
                        array_origin.push(await OriginModel.findOne({ _id: ObjectId(orig) }));
                    }
                }

                variable.origins = array_origin;
            }

            variable.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando la Variable.');
                }

                return responsesH.sendResponseOk(res, value, 'Variable actualizada correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }*/
}

async function deleteVariable(req, res) {
    _id = req.params.id
    if (_id) {

        const variable = await VariableModel.findOne({ _id: _id });
        if (variable == null)
            return responsesH.sendError(res, 500, 'Variable no encontrada.');

        VariableModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando la Variable.');
            }

            return responsesH.sendResponseOk(res, value, 'Variable eliminada correctamente.');
        });
        try {
            fs.unlinkSync(variable.image_route);
        } catch (err) {

        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function getVariableByClasification(id_Clasification, req, res) {

    const sort = { name: 1 };

    VariableModel.find({ 'obj_Clasification._id': ObjectId(id_Clasification), active: true }, (err, value) => {
        if (err) {
            return responsesH.sendError(res, 500, messageError);
        }
        return responsesH.sendResponseOk(res, value);
    }).sort(sort);
}

module.exports = {
    addVariable,
    updateVariable,
    deleteVariable,
    getVariableByClasification
}
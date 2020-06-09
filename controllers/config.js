const ConfigModel = require('../models/config');
var mongoose = require('mongoose');

const {addValidation, updateValidation} = require('../validation/configValidation');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

function addConfig(req, res) {
    const body = req.body;
    if (body) {

        //validate form with @hapi/joi
        const {error} = addValidation(req.body);
        if (error) 
            return responsesH.sendError(res, 400, messageErrorBody);       

        const config = new ConfigModel({
                name: body.name || '',
                value: body.value || ''
            });
            
        config.save((err, value) => {
                if (err) 
                    return responsesH.sendError(res, 500, messageError); 
                
                return responsesH.sendResponseOk(res, value, 'Configuración insertada correctamente.');
            });

    } else {
        return responsesH.sendError(res, 500, messageErrorBody); 
    }
}

function updateConfig(req, res) {
    const body = req.body;
    if (body) {
        const _id = req.params.id;

        //validate form with @hapi/joi
        const {error} = updateValidation(req.body);
        if (error) return res.status(400).send({
            code: 'ERROR',
            message: messageErrorBody,
            results: { error } }); 

        ConfigModel.findById(_id, (err, config) => {
            if (err) {
                return res.status(500).send({
                    code: 'ERROR',
                    message: 'Configuración no encontrada.',
                    results: { err }
                })
            }
            
            //Update config
            if (req.body.name)         config.name = req.body.name;
            if (req.body.value)        config.value = req.body.value;

            config.save((err, value) => {
                if (err) {
                    return res.status(500).send({
                        code: 'ERROR',
                        message: 'Error actualizando configuración.',
                        results: 
                            {
                                data: value
                            }
                    });
                }
               
                return res.status(200).send({
                    code: 'OK',
                    message: 'Configuración actualizada correctamente.',
                    results: 
                        {
                            data: value
                        }
                });
            });

        });      
    } else {
        return res.status(500).send({
            code: 'ERROR',
            message: messageErrorBody,
            results: {}
        });
    }
}

function deleteConfig(req, res) {
    _id = req.params.id
    if (_id) {
        ConfigModel.deleteOne( { _id: _id}, (err, value) => {
            if (err) {
                return res.status(500).send({
                    code: 'ERROR',
                    message: 'Error eliminando configuración.',
                    results: 
                        {
                            data: value
                        }
                });
            }

            return res.status(200).send({
                code: 'OK',
                message: 'Configuración eliminada correctamente.',
                results:
                    {
                        data: value
                    }
            });
        });
    } else {
        return res.status(500).send({
            code: 'ERROR',
            message: messageErrorBody,
            results: {}
        });
    }
}

function getConfigs(req, res) {

    var page = 1;
    var limit = 10;
    var ascending = 'true';
    var sort = 'name';

    if (req.query.page)
        page = parseInt(req.query.page) + 1;
    if (req.query.limit)
        limit = req.query.limit;
    if ( req.query.ascending )
        ascending = req.query.ascending;
    if ( req.query.sort )
        sort = req.query.sort;

    if ( ascending === 'false' ) {
        sort = '-' + sort;
    }

    if (req.params.id) {
        ConfigModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return res.status(500).send({
                    code: 'ERROR',
                    message: messageError,
                    results: {}
                })
            }
            return res.status(200).send({
                code: 'OK',
                message: '',
                results: {value}
            });
        });
    } else {
        ConfigModel.paginate({}, { page, limit, sort }, (err, value) => {
            if (err) {
                return res.status(500).send({
                    code: 'ERROR',
                    message: messageError,
                    results: {}
                })
            }
            return res.status(200).send({
                code: 'OK',
                message: '',
                results: {
                    data: value.docs,
                    totalPages: value.totalPages,
                    totalDocs: value.totalDocs,
                    currentPage: value.page - 1
                }
                
            })
        });
    }
}



module.exports = {
    addConfig,
    getConfigs,
    updateConfig,
    deleteConfig
}
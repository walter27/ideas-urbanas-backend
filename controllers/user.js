const UserModel = require('../models/user');
const ConfigModel = require('../models/config');
var mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { addValidation, updateValidation, update_passwordValidation } = require('../validation/userValidation');
const { sendEmail } = require('./email');

const { user_logued } = require('./common');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

function getUsers(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        UserModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        UserModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

async function addUser(req, res) {
    const body = req.body;
    if (body) {

        //validate form with @hapi/joi
        const { error } = addValidation(req.body);
        if (error) {
            return responsesH.sendError(res, 400, messageErrorBody);
        }

        if (body.email) {

            //Validate email unique
            const us = await UserModel.findOne({ email: body.email });
            if (us) {
                return responsesH.sendError(res, 400, 'Email existente.');
            }

            //generando contraseña random
            // const password = crypto.randomBytes(20).toString('hex');

            const user = new UserModel({
                name: body.name || '',
                last_name: body.last_name || '',
                email: body.email,
                password: body.password,
                password_changed: true
            });
            user.save(async(err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, messageError);
                }
                // value.password = password;

                // var mail_company = await ConfigModel.findOne({name: 'EMAIL'});

                // const data = [];
                // data.from = '"Laboratorio de IDEas Urbanas" <' + mail_company.value + '>';
                // data.to = body.email;
                // data.subject = 'Bienvenido al Laboratorio de IDEas Urbanas';
                // data.content = 'Hola ' + body.name + ', ha sido registrado como nuevo administrador de nuestro sitio.' +
                //     ' Su contraseña es ' + password +
                //     '. Le sugerimos cambiarla lo antes posible. Saludos cordiales, Laboratorio de IDEas Urbanas.';

                // sendEmail(data);

                return responsesH.sendResponseOk(res, value, 'Usuario insertado correctamente.');
            });
        } else {
            return responsesH.sendError(res, 500, messageErrorBody);
        }
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}


function updateUser(req, res) {
    const body = req.body;
    if (body) {
        const _id = req.params.id;

        //validate form with @hapi/joi
        const { error } = updateValidation(req.body);
        if (error) {
            return responsesH.sendError(res, 400, messageErrorBody);
        }
        //Search user to update and update
        UserModel.findById(_id, async(err, user) => {
            if (err) {

                return responsesH.sendError(res, 500, 'Usuario no encontrado.');
            }

            //var user_log = await user_logued(req, res);

            // if (user_log.email != user.email)
            //     return responsesH.sendError(res, 500, 'Usuario sin permiso para actualizar la información.');

            //Update user
            if (body.name) user.name = body.name;
            if (body.last_name) user.last_name = body.last_name || '';
            if (body.email) user.email = body.email;
            if (body.password) {
                user.password = body.password;
                user.password_changed = true;
            }

            user.save((err, value) => {
                if (err) {

                    return responsesH.sendError(res, 500, 'Error actualizando usuario.');
                }

                return responsesH.sendResponseOk(res, value, 'Usuario actualizado correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

async function deleteUser(req, res) {
    _id = req.params.id
    if (_id) {

        // var user_log = await user_logued(req, res);

        UserModel.deleteOne({ _id: _id }, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Error eliminando usuario.');
            }

            return responsesH.sendResponseOk(res, value, 'Usuario eliminado correctamente.');
        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

function updatePassword(req, res) {
    const body = req.body;
    if (body) {
        const _id = req.params.id;
        if (body.password) {
            body.password_new = body.password;
            body.password_confirmation = true;
        }
        //validate form with @hapi/joi
        const { error } = update_passwordValidation(body);
        console.log(error);
        if (error)
            return responsesH.sendError(res, 400, messageErrorBody);

        UserModel.findById(_id, async(err, user) => {
            if (err) {
                return responsesH.sendError(res, 500, 'Usuario no encontrado.');
            }

            //Password is correct?
            const validPass = await bcrypt.compare(body.password, user.password);
            if (!validPass)
                return responsesH.sendError(res, 400, 'Contraseña actual incorrecta.');

            //Update pass
            if (req.body.password_new) {
                user.password = req.body.password_new;
                user.password_changed = true;
            }

            user.save((err, value) => {
                if (err) {
                    return responsesH.sendError(res, 500, 'Error actualizando contraseña.');
                }

                return responsesH.sendResponseOk(res, value, 'Su contraseña ha sido actualizada correctamente.');
            });

        });
    } else {
        return responsesH.sendError(res, 500, messageErrorBody);
    }
}

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    updatePassword
}
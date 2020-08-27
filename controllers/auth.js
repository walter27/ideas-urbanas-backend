const UserModel = require('../models/user');
const ConfigModel = require('../models/config');

var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const { loginValidation, forgotPasswordValidation, forceChangePasswordValidation } = require('../validation/authValidation');
const { sendEmail } = require('./email');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'


async function login(req, res) {
    var email = req.body.email;
    var pass = req.body.password;
    //Validate form with @hapi/joi
    const { error } = loginValidation(req.body);
    if (error) {
        //console.log(error);
        return responsesH.sendError(res, 400, messageErrorBody);
    }

    //Checking if the email exists
    const user = await UserModel.findOne({ email: email });
    if (!user)
        return responsesH.sendError(res, 400, 'Email o Password incorrecto.');

    //Password is correct
    const validPass = await bcrypt.compare(pass, user.password);
    if (!validPass)
        return responsesH.sendError(res, 400, 'Email o Password incorrecto.');

    //Create and assign a token
    user.password = null;
    const token_secret = await ConfigModel.findOne({ name: 'TOKEN_SECRET' });

    if (user.password_changed == false) {
        const token = jwt.sign({ email: user.email }, token_secret.value);
        return res.status(200).header('Authorization', token).send({
            code: 'OK',
            message: 'Usuario no ha cambiado password.',
            results: {
                token: token
            }
        });
    } else {
        const token = jwt.sign({ user }, token_secret.value);
        return res.status(200).header('Authorization', token).send({
            code: 'OK',
            message: 'Usuario logueado.',
            results: {
                token: token
            }
        });
    }
}

async function forgotPassword(req, res) {
    var email = req.body.email;

    //Validate form with @hapi/joi
    const { error } = forgotPasswordValidation(req.body);
    if (error)
        return responsesH.sendError(res, 400, messageErrorBody);

    //Checking if the email exists
    const user = await UserModel.findOne({ email: email });
    if (!user)
        return responsesH.sendError(res, 400, 'Correo electrónico inválido.');

    const password = crypto.randomBytes(20).toString('hex');
    user.password = password;
    user.password_changed = false;

    user.save(async(err, value) => {
        if (err)
            return responsesH.sendError(res, 500, messageError);

        var mail_company = await ConfigModel.findOne({ name: 'EMAIL' });

        const data = [];
        data.from = '"Laboratorio de IDEas Urbanas" <' + mail_company.value + '>';
        data.to = email;
        data.subject = 'Nueva contraseña.';
        data.content = 'Hola ' + value.name + ', su solicitud ha sido atendida.' +
            ' Su nueva contraseña es ' + password +
            '. Le sugerimos cambiarla lo antes posible. Saludos cordiales, Laboratorio de IDEas Urbanas.';
        sendEmail(data);

        return responsesH.sendResponseOk(res, value, 'Su contraseña ha sido actualizada correctamente y enviada a su email.');

    });

}

async function forceChangePassword(req, res) {
    var password = req.body.password;

    //Validate form with @hapi/joi
    const { error } = forceChangePasswordValidation(req.body);
    if (error)
        return responsesH.sendError(res, 400, messageErrorBody);

    //Obtain User
    const token = req.header('Authorization');
    const token_secret = await ConfigModel.findOne({ name: 'TOKEN_SECRET' });
    var verified = null;

    try {
        verified = jwt.verify(token, token_secret.value);
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            code: 'ERROR',
            message: 'Problemas de autenticación.',
            results: { token }
        });
    }

    var user = null;
    if (verified.email) {
        user = await UserModel.findOne({ email: verified.email });
        if (!user)
            return responsesH.sendError(res, 400, 'Correo electrónico inválido.');
    } else {
        return responsesH.sendError(res, 400, 'Correo electrónico inválido.');
    }

    user.password = password;
    user.password_changed = true;

    user.save(async(err, value) => {
        if (err)
            return responsesH.sendError(res, 500, messageError);

        var mail_company = await ConfigModel.findOne({ name: 'EMAIL' });

        const data = [];
        data.from = '"Laboratorio de IDEas Urbanas" <' + mail_company.value + '>';
        data.to = verified.email;
        data.subject = 'Contraseña actualizada correctamente.';
        data.content = 'Hola ' + value.name + ', su contraseña ha sido actualizada correctamente.';
        sendEmail(data);

        return responsesH.sendResponseOk(res, value, 'Su contraseña ha sido actualizada correctamente.');

    });
}


module.exports = {
    login,
    forgotPassword,
    forceChangePassword
}
const ConfigModel = require('../models/config');
const DataModel = require('../models/data');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

async function user_logued(req, res) { //Usuario logueado
    const token = req.header('Authorization');
    const token_secret = await ConfigModel.findOne({ name: 'TOKEN_SECRET' });
    var verified;

    try {
        verified = jwt.verify(token, token_secret.value);
    } catch (err) {
        return res.status(400).send({
            code: 'ERROR',
            message: 'Problemas de autenticación.',
            results: { token }
        });
    }

    return verified.user;
}

function getDatas(req, res) {

    const filters = filtersH.buildFilters(req);

    filters.sort = filters.sort + ' and year';

    var extra_filters = { 'obj_Canton.active': true };
    if (req.body.id_Variable) {
        extra_filters['obj_Variable._id'] = ObjectId(req.body.id_Variable);
    }
    if (req.body.years) {
        extra_filters.year = { $in: req.body.years };
    }
    if (req.body.cities) {
        var cities = [];
        for (var i = 0; i < req.body.cities.length; i++) {
            cities.push(ObjectId(req.body.cities[i]));
        }

        extra_filters = {
            $and: [
                extra_filters,
                { 'obj_Canton._id': { $in: cities } }
            ]
        };
    }

    console.log(extra_filters);
    let data = DataModel.paginate(extra_filters, filters);
    console.log(data);



    return DataModel.paginate(extra_filters, filters);


}



module.exports = {
    user_logued,
    getDatas,

}
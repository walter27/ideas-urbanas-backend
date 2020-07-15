const ClasificationModel = require('../models/clasification');
const VariableModel = require('../models/variable');
const IndicatorModel = require('../models/indicator');
const ResearchModel = require('../models/research');
const ReportsModel = require('../models/reports');
const ProvinciaModel = require('../models/provincia');
const CantonModel = require('../models/canton');
const OriginModel = require('../models/origin');
const DataModel = require('../models/data');

const variableController = require('../controllers/variable');
const researchController = require('../controllers/research');
const tagController = require('../controllers/tag');
const commonController = require('../controllers/common');
const indicesController = require('../controllers/indices');

const responsesH = require('../helpers/responses');
const filtersH = require('../helpers/filters');

const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'

var ObjectId = require('mongoose').Types.ObjectId;

const path = require('path');
const fs = require('fs');
const os = require('os');
const clasification = require('./clasification');

function getClasifications(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        ClasificationModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        ClasificationModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function getVariables(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        VariableModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        VariableModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function getResearchs(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        if (!ObjectId.isValid(req.params.id))
            return responsesH.sendError(res, 500, messageError);

        ResearchModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        ResearchModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function getReports(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        if (!ObjectId.isValid(req.params.id))
            return responsesH.sendError(res, 500, messageError);

        ReportsModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        ReportsModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function getCantons(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        CantonModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        CantonModel.paginate({ active: true }, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function getProvincias(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        ProvinciaModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        ProvinciaModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function getOrigins(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        OriginModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        OriginModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

async function getDatas(req, res) {

    return responsesH.sendResponseOk(res, await commonController.getDatas(req, res));
}

async function getDatasCovid(req, res) {

    return responsesH.sendResponseOk(res, await commonController.getDatasCovid(req, res));

}

async function getDatasCSV(req, res) {

    return responsesH.sendResponseCSV(res, await commonController.getDatas(req, res));
}


async function exportDatas(req, res) {

    var values = await commonController.getDatas(req, res);

    const filename = path.join(__dirname, 'datas.csv');
    const output = [];

    const variable = await VariableModel.findById(String(req.body.id_Variable));

    const header = []; // a new array for each row of data
    header.push('RESUMEN DE DATOS OBTENIDOS PARA LA VARIABLE "' + variable.name + '"');
    output.push(header.join());

    const row = []; // a new array for each row of data
    row.push('CIUDAD');
    row.push('AÑO');
    row.push('DATO');
    output.push(row.join());

    values.docs.forEach((dato) => {
        const row = []; // a new array for each row of data
        row.push(dato.obj_Canton.name);
        row.push(dato.year);

        if (Object.getPrototypeOf(dato.value) === Object.prototype)
            row.push(JSON.stringify(dato.value).replace(/,/g, ';'));
        else
            row.push(dato.value);

        output.push(row.join());
    });

    fs.writeFileSync(filename, output.join(os.EOL), { encoding: 'binary' });

    //fs.unlink(filename);

    return res.status(200).download(filename);

}

function getIndicators(req, res) {

    const filters = filtersH.buildFilters(req);

    if (req.params.id) {
        IndicatorModel.findById(String(req.params.id), (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }

            return responsesH.sendResponseOk(res, value);
        });
    } else {
        IndicatorModel.paginate({}, filters, (err, value) => {
            if (err) {
                return responsesH.sendError(res, 500, messageError);
            }
            return responsesH.sendResponseOk(res, value);
        });
    }
}

function inicio(req, res) {

    var value = [];
    return responsesH.sendResponseOk(res, value, 'Pagina de inicio.');
}

function images(req, res) {

    var route = path.join(__dirname, '/../images', req.params.id);
    return res.sendFile(route);
}

function logo(req, res) {

    var route = path.join(__dirname, '/../logo', 'logo2.png');
    return res.sendFile(route);
}


function getVariableByClasification(req, res) {

    const id_Clasification = req.body.id_Clasification;

    if (ObjectId.isValid(id_Clasification)) {
        return variableController.getVariableByClasification(id_Clasification, req, res);
    } else {
        return responsesH.sendError(res, 400, 'Temáticas no encontrada.');
    }

}

function getResearchsByCatAndCant(req, res) {

    return researchController.getResearchsByCatAndCant(req, res);

}

function getTagsByCantByType(req, res) {

    return tagController.getTagsByCantByType(req, res);

}


function getStopwords(req, res) {

    return tagController.getStopwords(req, res);

}

function addTag(req, res) {

    return tagController.addTag(req, res);

}

function getYearsAvailableForVariable(req, res) {

    const idVariable = req.params.id;

    if (!ObjectId.isValid(idVariable))
        return responsesH.sendError(res, 500, messageError);


    var extra_filters = { 'obj_Canton.active': true };

    extra_filters['obj_Variable._id'] = ObjectId(idVariable);

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

    DataModel.paginate(extra_filters, { limit: 10000 }, (err, value) => {
        if (err) {
            return responsesH.sendError(res, 500, 'Error en los datos enviados.');
        }
        var years = new Set();
        value.docs.forEach(v => {
            years.add(v.year);
        });
        return res.status(200).send({
            years: [...years].sort()
        })
    });

}


function loadRegions(regions) {

    var regions_file = fs.readFileSync(regions.path);
    var regions_json = JSON.parse(regions_file);

    var prov = {};
    var cant = {};

    var len = regions_json.length;
    for (var r = 0; r < len; r++) {

        if (!regions_json[r].parent) {
            prov[regions_json[r]._id] = regions_json[r].name;
            const provincia = ProvinciaModel.findOne({ 'name': regions_json[r].name });

            if (provincia == null) {
                const provincia_new = new ProvinciaModel({
                    name: regions_json[r].name,
                    description: regions_json[r].description,
                    active: true
                });

                provincia_new.save();
            }
        }

    }

    for (var r = 0; r < len; r++) {

        if (regions_json[r].parent) {
            cant[regions_json[r]._id] = regions_json[r].name;

            const provincia = ProvinciaModel.findOne({ 'name': prov[regions_json[r].parent] });
            const canton = CantonModel.findOne({ 'name': regions_json[r].name });

            if (canton == null || provincia == null) {
                const canton_new = new CantonModel({
                    code: regions_json[r]._id,
                    name: regions_json[r].name,
                    description: regions_json[r].description,
                    obj_Provincia: provincia,
                    active: false
                });

                canton_new.save();
            }
        }

    }

    return { cant };

}


async function loadJSON(req, res) {

    var variables_file = fs.readFileSync(req.files.variables.path);
    var variables_json = JSON.parse(variables_file);
    variables_json.forEach(async variable => {

        if (variable.parent != '') {
            var act_variable = new VariableModel();
            act_variable = await VariableModel.findOne({ 'code': variable._id });

            act_variable.code = variable._id;
            act_variable.abbrevation = variable.abbrevation;
            act_variable.periodicity = variable.periodicity;
            act_variable.measure = variable.measure;
            act_variable.measure_symbol = variable.measure_symbol;
            act_variable.label = variable.label;
            act_variable.observations = variable.observations;

            await act_variable.save();
        }

    });

    const { cant } = loadRegions(req.files.regions);

    var data_file = fs.readFileSync(req.files.data.path);
    var data_json = JSON.parse(data_file);


    var len = data_json.length;
    for (var d = 0; d < len; d++) {

        const data = data_json[d];

        const variable = await VariableModel.findOne({ 'code': data.id_variable });
        const canton = await CantonModel.findOne({ 'name': cant[data.id_region] });

        if (!canton || !variable) { continue; }

        var year = data.date.substring(6, 10);

        var dato = null;
        if (data.id_variable == '0203') { //Variables con periodicidad mensual
            dato = await DataModel.findOne({
                'obj_Canton._id': canton._id,
                'obj_Variable._id': variable._id,
                'year': parseInt(year)
            });
        }

        if (dato) {
            dato.value = dato.value + data.value;
            await dato.save();
        } else {
            const valor = new DataModel({
                value: data.value,
                description: data.descriptions,
                obj_Variable: variable,
                obj_Canton: canton,
                year: year,
                active: true
            });

            await valor.save();
        }
    }

    return responsesH.sendResponseOk(res, [], 'Datos actualizados correctamente.');
}


async function getIndexes(req, res) {

    var indexes = {};

    const clasifications = await ClasificationModel.find({});

    let clasificationsFinal = clasifications.filter(calsification => calsification.name !== "Corona Virus");

    var cities = null;
    if (req.body.cities)
        cities = await CantonModel.find({ _id: { $in: req.body.cities }, active: true });
    else
        cities = await CantonModel.find({ active: true });

    var id_cities = [];
    cities.forEach(async city => {
        indexes[city.name] = {};
        id_cities.push(city._id);
    });

    var years = [];
    if (req.body.years)
        years = req.body.years;
    else {
        let min_year = await DataModel.findOne({
            'obj_Canton._id': { $in: id_cities },
            'obj_Canton.active': true
        }).sort('year');
        let max_year = await DataModel.findOne({
            'obj_Canton._id': { $in: id_cities },
            'obj_Canton.active': true
        }).sort('-year');
        for (let i = min_year.year; i <= max_year.year; i++)
            years.push(i);
    }



    for (let k = 0; k < clasificationsFinal.length; k++) {

        //Calcular el índice para cada clasification y cada ciudad//
        let index_name = clasificationsFinal[k].name.toLowerCase().replace(/ /g, '_')
            .replace(/á/g, "a")
            .replace(/é/g, "e")
            .replace(/í/g, "i")
            .replace(/ó/g, "o")
            .replace(/ú/g, "u")
            .replace(/ñ/g, "n");

        for (let j = 0; j < cities.length; j++) {

            indexes[cities[j].name][clasifications[k].name] = await eval('indicesController.' + index_name + '(cities[j],years)');
        }

        ////////////////Fin del calculo/////////////////

    }

    //var max_value = years.length*3;
    //Normalizando Resultados de los Índices.
    for (let k = 0; k < clasifications.length; k++) {
        var max_value = 0;

        var indicators = await IndicatorModel.find({ 'obj_Clasification._id': clasifications[k]._id });
        indicators.forEach(element => {
            max_value += Math.max(element.configs[0][1], element.configs[1][1], element.configs[2]);
        });

        max_value = max_value * years.length;

        if (max_value == 0) continue;

        for (let j = 0; j < cities.length; j++) {
            indexes[cities[j].name][clasifications[k].name] = Math.round((indexes[cities[j].name][clasifications[k].name] / max_value) * 100);
        }

    }

    return responsesH.sendResponseOk(res, indexes, 'Índices obtenidos correctamente.');
}

module.exports = {
    inicio,
    images,
    logo,
    getVariableByClasification,
    getResearchsByCatAndCant,
    loadJSON,
    getClasifications,
    getVariables,
    getResearchs,
    getReports,
    getProvincias,
    getCantons,
    getOrigins,
    getDatas,
    getIndexes,
    getYearsAvailableForVariable,
    getTagsByCantByType,
    exportDatas,
    getIndicators,
    addTag,
    getStopwords,
    getDatasCSV,
    getDatasCovid
}
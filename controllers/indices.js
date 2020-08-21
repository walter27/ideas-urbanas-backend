const DataModel = require('../models/data');
const IndicatorModel = require('../models/indicator');

/*async function value_data(indicator_name, variable_name, city_id, years) {

    var value = 0;

    var indicator = await IndicatorModel.findOne({'name': indicator_name});
    var datas = await DataModel.find({'obj_Variable.name': variable_name, 
                                        'obj_Canton._id': city_id,
                                        'year': {$in: years}});

    if (!indicator || !datas) return 0;

    datas.forEach( data => {

        if ( typeof data.value === 'object' ) {
            data.value = data.value['si'];
        }

        if (data.value <= indicator.configs[0][0]) value = value + indicator.configs[0][1];
        else if ( data.value <= indicator.configs[1][0] ) value = value + indicator.configs[1][1];
        else value = value + indicator.configs[2][0];

    });
    
    return value;
}

async function desarrollo_social(city, years)
{
    var value = 0;
    //Asistencia a bachillerato
    value = value + await value_data('Asistencia a bachillerato', 'Asistencia a bachillerato', city._id, years);

    //Desempleo
    value = value + await value_data('Desempleo', 'Desempleo', city._id, years);

    //Años promedio de escolaridad
    value = value + await value_data('Anos de escolaridad', 'Anos de escolaridad', city._id, years);

    return value;
}

async function desarrollo_economico(city, years)
{

    var value = 0;
    //Déficit cuantitativo de vivienda
    value = value + await value_data('Numero de empresas', 'Numero de empresas', city._id, years);

    return value;
}

async function servicios_basicos(city, years)
{
    var value = 0;
    //Viviendas abastecidas de agua por red publica
    value = value + await value_data('Viviendas abastecidas de agua por red publica', 'Viviendas abastecidas de agua por red publica', city._id, years);

    //Viviendas con servicio de recoleccion de basura por carro recolector
    value = value + await value_data('Viviendas con servicio de recoleccion de basura por carro recolector', 'Viviendas con servicio de recoleccion de basura por carro recolector', city._id, years);

    //Viviendas abastecidas de Red de alcantarillado
    value = value + await value_data('Viviendas abastecidas de Red de alcantarillado', 'Viviendas abastecidas de Red de alcantarillado', city._id, years);

    return value;
}

async function vivienda_y_ambiente(city, years)
{
    var value = 0;
    //Déficit cuantitativo de vivienda
    value = value + await value_data('Deficit habitacional cuantitativo', 'Deficit habitacional cuantitativo', city._id, years);

    //Déficit cualitativo de vivienda
    value = value + await value_data('Deficit habitacional cualitativo', 'Deficit habitacional cualitativo', city._id, years);

    //Verde urbano
    value = value + await value_data('Indice verde urbano', 'Indice verde urbano', city._id, years);

    return value;
}

function gobernanza(city, years)
{
    return 0;
    //return Math.floor(Math.random()*3+1)*years.length;
}*/

async function value_data(indicator_name, variable_code, city_id, years) {

    var value = 0;

    var indicator = await IndicatorModel.findOne({ 'name': indicator_name });
    var datas = await DataModel.find({
        'obj_Variable.code': variable_code,
        'obj_Canton._id': city_id,
        'year': { $in: years }
    });

    if (!indicator || !datas) return 0;

    datas.forEach(data => {

        if (typeof data.value === 'object') {
            data.value = data.value['si'];
        }
        if (data.value <= indicator.configs[0][0]) value = value + indicator.configs[0][1];
        else if (data.value <= indicator.configs[1][0]) value = value + indicator.configs[1][1];
        else value = value + indicator.configs[2][0];

    });

    return value;
}

async function desarrollo_social(city, years) {

    let indicators = [];
    var value = 0;
    //Asistencia a bachillerato
    value = value + await value_data('Asistencia a bachillerato', '0107', city._id, years);

    indicators.push({
        name: 'Asistencia a bachillerato',
        data: await value_data('Asistencia a bachillerato', '0107', city._id, years)
    })

    //Desempleo
    value = value + await value_data('Desempleo', '0102', city._id, years);

    indicators.push({
        name: 'Desempleo',
        data: await value_data('Desempleo', '0102', city._id, years)
    })

    //Años promedio de escolaridad
    value = value + await value_data('Anos de escolaridad', '0104', city._id, years);

    indicators.push({
        name: 'Anos de escolaridad',
        data: await value_data('Anos de escolaridad', '0104', city._id, years)
    })

    return { value, indicators };
}

async function desarrollo_economico(city, years) {

    let indicators = [];
    var value = 0;
    //Déficit cuantitativo de vivienda
    value = value + await value_data('Numero de empresas', '0108', city._id, years);

    indicators.push({
        name: 'Numero de empresas',
        data: await value_data('Numero de empresas', '0108', city._id, years)
    })

    return { value, indicators };
}

async function servicios_basicos(city, years) {

    let indicators = []
    var value = 0;
    //Viviendas abastecidas de agua por red publica
    value = value + await value_data('Viviendas abastecidas de agua por red publica', '0501', city._id, years);
    indicators.push({
        name: 'Viviendas abastecidas de agua por red publica',
        data: await value_data('Viviendas abastecidas de agua por red publica', '0501', city._id, years)
    })


    //Viviendas con servicio de recoleccion de basura por carro recolector
    value = value + await value_data('Viviendas con servicio de recoleccion de basura por carro recolector', '0503', city._id, years);
    indicators.push({
        name: 'Viviendas con servicio de recoleccion de basura por carro recolector',
        data: await value_data('Viviendas con servicio de recoleccion de basura por carro recolector', '0503', city._id, years)
    })


    //Viviendas abastecidas de Red de alcantarillado
    value = value + await value_data('Viviendas abastecidas de Red de alcantarillado', '0502', city._id, years);
    indicators.push({
        name: 'Viviendas abastecidas de Red de alcantarillado',
        data: await value_data('Viviendas abastecidas de Red de alcantarillado', '0502', city._id, years)
    })

    return { value, indicators };
}

async function vivienda_y_ambiente(city, years) {

    let indicators = []
    var value = 0;
    //Déficit cuantitativo de vivienda
    value = value + await value_data('Deficit habitacional cuantitativo', '0402', city._id, years);
    indicators.push({
        name: 'Deficit habitacional cuantitativo',
        data: await value_data('Deficit habitacional cuantitativo', '0502', city._id, years)
    })

    //Déficit cualitativo de vivienda
    value = value + await value_data('Deficit habitacional cualitativo', '0401', city._id, years);
    indicators.push({
        name: 'Deficit habitacional cualitativo',
        data: await value_data('Deficit habitacional cualitativo', '0401', city._id, years)
    })

    //Verde urbano
    value = value + await value_data('Indice verde urbano', '0405', city._id, years);
    indicators.push({
        name: 'Indice verde urbano',
        data: await value_data('Indice verde urbano', '0405', city._id, years)
    })

    return { value, indicators };
}

function gobernanza(city, years) {

    let indicators = [];
    var value = 0

    return { value, indicators };
    //return Math.floor(Math.random()*3+1)*years.length;
}

module.exports = {
    desarrollo_social,
    desarrollo_economico,
    servicios_basicos,
    vivienda_y_ambiente,
    gobernanza
}
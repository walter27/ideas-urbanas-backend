const DataModel = require('../models/data');
const IndicatorModel = require('../models/indicator');
const VariableModel = require('../models/variable');
var ObjectId = require('mongoose').Types.ObjectId;
const responsesH = require('../helpers/responses');
const messageError = 'Ha ocurrido un error en el servidor, vuelva a intentarlo'
const messageErrorBody = 'No ha enviado algún dato'
const messageErrorParams = 'No ha enviado los parámetros'
const roundTo = require('round-to');
let data = [];




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

async function intervalo_data(variable, id_cities, years) {

    let values = [];
    let valuesYN = [];
    let rango = [];
    var value = 0;
    let last_values;
    let last_datas = [];
    let color;
    let level;

    //console.log(years, indicator_name, variable_code);

    var datas = await DataModel.find({ 'obj_Variable.code': variable.code, 'obj_Canton.code': { $in: id_cities }, 'year': { $in: years } });


    //if (!indicator || !datas) return 0;



    /*for (let i = 0; i < datas.length; i++) {

        if (i <= id_cities.length - 1) {

            // console.log(i, id_cities.length);
            await values.push(datas[i].value)

        }

    }*/


    if (datas.length > id_cities.length) {
        last_values = datas.length - id_cities.length
        for (let i = last_values; i < datas.length; i++) {

            if (variable.code !== '0801' || variable.code !== '0802' || variable.code !== '0803') {

                await values.push(datas[i].value)

            }
            await last_datas.push(datas[i]);

        }
    } else {
        datas.forEach(async data => {



            if (variable.code !== '0801' || variable.code !== '0802' || variable.code !== '0803') {

                await values.push(data.value)

            }
            // last_datas.push(data);

        });

        last_datas = datas;

        //console.log('DATAS', last_datas);

    }


    if (variable.code === '0801') {

        rango.push({
            value: "Si",
            level: "Alto",
            color: "green"

        })

        rango.push({
            value: "No",
            level: "Bajo",
            color: 'red'


        })

        last_datas = datas;

        return ({ rango, data: last_datas })


    }

    if (variable.code === '0802') {

        rango.push({
            value: "Si, totalmente",
            level: "Alto",
            color: 'green'

        })

        rango.push({
            value: "Si, parcialmente",
            level: "Medio",
            color: 'yellow'

        })

        rango.push({
            value: "No",
            level: "Bajo",
            color: 'red'

        })

        last_datas = datas;

        return ({ rango, data: last_datas })


    }

    if (variable.code === '0803') {

        rango.push({
            value: "Si",
            level: "Alto",
            color: "green"

        })

        rango.push({
            value: "Existe la opción pero hay dificultades en el cargado de la página",
            level: "Medio",
            color: 'yellow'

        })

        rango.push({
            value: "No",
            level: "Bajo",
            color: 'red'

        })

        last_datas = datas;

        return ({ rango, data: last_datas })


    }


    //console.log('VALORES', valuesYN);

    //console.log('VALORES', values);



    if (values.length > 0) {



        let min_intervalo;
        let max_intervalo = 0;
        let value_min = Math.min(...values)
        let value_max = Math.max(...values)
        let intervalo = (value_max - value_min) / 3


        while (max_intervalo < value_max) {


            if (rango.length > 0) {

                let last_intervalo = rango[rango.length - 1]

                //console.log('ULTIMO', last_intervalo);
                min_intervalo = last_intervalo.max_intervalo;
                max_intervalo = last_intervalo.max_intervalo + intervalo;

                color = 'yellow'
                level = 'Medio'

                if (roundTo(max_intervalo, 2) === roundTo(value_max, 2)) {


                    let last_max_intervalo = roundTo(max_intervalo, 2);
                    max_intervalo = last_max_intervalo;

                    if (variable.code === '0212' || variable.code === '0215' || variable.code === '0104' || variable.code === '0105' ||
                        variable.code === '0521' || variable.code === '0522' || variable.code === '0520' || variable.code === '0523') {

                        color = 'green'
                        level = 'Alto'
                    } else {
                        color = 'red'
                        level = 'Alto'

                    }
                }

                rango.push({
                    min_intervalo,
                    max_intervalo,
                    color,
                    level

                })

            } else {



                min_intervalo = value_min;
                max_intervalo = value_min + intervalo;


                if (variable.code === '0212' || variable.code === '0215' || variable.code === '0105' || variable.code === '0520' ||
                    variable.code === '0104' || variable.code === '0521' || variable.code === '0522' || variable.code === '0523') {
                    color = 'red'
                    level = 'Baja'

                } else {
                    color = 'green'
                    level = 'Baja'

                }

                rango.push({
                    min_intervalo,
                    max_intervalo,
                    color,
                    level

                })
            }


        }

        return ({ rango, data: last_datas })
            // color_data(rango, variable_code, id_citie, last_datas)


    }


    /*datas.forEach(data => {

        if (typeof data.value === 'object') {
            data.value = data.value['si'];
        }
        if (data.value <= indicator.configs[0][0]) {
            value = value + indicator.configs[0][1];
        } else {
            if (data.value <= indicator.configs[1][0]) {
                value = value + indicator.configs[1][1];
            } else {
                value = value + indicator.configs[2][0];
            }
        }

    });*/

    //return value;
}


async function color_data(datas, id_Cities, clasification) {

    let datas_Variables = [];



    if (datas.length > 0) {
        //console.log('DATOs', datas.length);

        for (let l = 0; l < id_Cities.length; l++) {
            let dataCity = datas.filter(data => data.data.obj_Canton.code === id_Cities[l])




            let value_indicador = 0;
            let value;
            let year;
            let variables = []
            let origins = [];


            /* for (const data of dataCity) {

                 let indicator = await IndicatorModel.findOne({ 'obj_Variable.code': data.data.obj_Variable.code, 'obj_Canton.code': data.data.obj_Canton.code });

                 if (indicator) {
                     variables.push(indicator.ridit)

                 }

             }*/


            /*for (let i = 0; i < dataCity.length; i++) {
                let indicator = await IndicatorModel.findOne({ 'obj_Variable.code': dataCity[i].data.obj_Variable.code, 'obj_Canton.code': dataCity[i].data.obj_Canton.code });

                if (indicator) {
                    variables.push(indicator.ridit)

                }
            }*/


            /* dataCity.forEach(async data => {
                 let indicator = await IndicatorModel.findOne({ 'obj_Variable.code': data.data.obj_Variable.code, 'obj_Canton.code': data.data.obj_Canton.code });

                 if (indicator) {
                     variables.push(indicator.ridit)

                 }

             });

             console.log(variables, id_Cities[i]);*/


            for (let i = 0; i < dataCity.length; i++) {




                //console.log(data);


                let indicator = await IndicatorModel.findOne({ 'obj_Variable.code': dataCity[i].data.obj_Variable.code, 'obj_Canton.code': dataCity[i].data.obj_Canton.code });

                if (indicator) {

                    //console.log(indicator.obj_Variable.name, data.obj_Canton.name, indicator.obj_Variable.obj_Clasification.name, i);
                    ///console.log('RANGO', dataCity[i].rango.length);

                    if (dataCity[i].data.obj_Variable.code === '0801' || dataCity[i].data.obj_Variable.code === '0802' || dataCity[i].data.obj_Variable.code === '0803') {


                        for (let j = 0; j < dataCity[i].rango.length; j++) {

                            //console.log(dataCity[i].data.value, dataCity[i].rango[j]);


                            if (dataCity[i].data.value === dataCity[i].rango[j].value) {



                                for (let k = 0; k < indicator.obj_Variable.values_indice.length; k++) {


                                    if (dataCity[i].data.year === indicator.obj_Variable.values_indice[k].year) {

                                        value = (indicator.ridit * indicator.obj_Variable.values_indice[k].value) / clasification.lambda
                                        value_indicador = value_indicador + value;





                                        variables.push({
                                            variable: indicator.obj_Variable,
                                            value,
                                            intervalo: dataCity[i].rango[j],
                                            rango: dataCity[i].rango,
                                            city: id_Cities[l],
                                            origen: `${dataCity[i].data.value}`,
                                            year: dataCity[i].data.year
                                        })

                                        //console.log(indicator.obj_Variable.name, indicator.obj_Canton.name, value, id_Cities[i]);


                                    }

                                }
                            }
                        }

                    } else {

                        for (let j = 0; j < dataCity[i].rango.length; j++) {



                            if (dataCity[i].rango.length - 1 === j) {
                                if (dataCity[i].data.value >= dataCity[i].rango[j].min_intervalo && dataCity[i].data.value <= dataCity[i].rango[j].max_intervalo) {


                                    for (let k = 0; k < indicator.obj_Variable.values_indice.length; k++) {



                                        if (dataCity[i].data.year === indicator.obj_Variable.values_indice[k].year) {



                                            value = (indicator.ridit * indicator.obj_Variable.values_indice[k].value) / clasification.lambda
                                            value_indicador = value_indicador + value;


                                            /*console.log('ridit', indicator.ridit);

                                            console.log('inidcator', indicator.obj_Variable.values_indice[k].value);
                                            console.log('lambda', clasification.lambda);
                                            console.log('VARIABLE', indicator.obj_Variable.name);
                                            console.log('ciudad', id_Cities[l]);
                                            console.log('OPERACION', value);*/


                                            variables.push({
                                                variable: indicator.obj_Variable,
                                                value,
                                                intervalo: dataCity[i].rango[j],
                                                rango: dataCity[i].rango,
                                                city: id_Cities[l],
                                                origen: `${dataCity[i].data.value}`,
                                                year: dataCity[i].data.year



                                            })

                                            //console.log('ultimo', indicator.obj_Variable.name, indicator.obj_Canton.name, value, id_Cities[i]);

                                        }

                                    }



                                }
                            } else {
                                if (dataCity[i].data.value >= dataCity[i].rango[j].min_intervalo && dataCity[i].data.value < dataCity[i].rango[j].max_intervalo) {


                                    for (let k = 0; k < indicator.obj_Variable.values_indice.length; k++) {



                                        if (dataCity[i].data.year === indicator.obj_Variable.values_indice[k].year) {

                                            value = (indicator.ridit * indicator.obj_Variable.values_indice[k].value) / clasification.lambda
                                            value_indicador = value_indicador + value;


                                            /* console.log('ridit', indicator.ridit);

                                             console.log('inidcator', indicator.obj_Variable.values_indice[k].value);
                                             console.log('lambda', clasification.lambda);
                                             console.log('VARIABLE', indicator.obj_Variable.name);
                                             console.log('ciudad', id_Cities[l]);
                                             console.log('OPERACION', value);*/

                                            variables.push({
                                                variable: indicator.obj_Variable,
                                                value,
                                                intervalo: dataCity[i].rango[j],
                                                rango: dataCity[i].rango,
                                                city: id_Cities[l],
                                                origen: `${dataCity[i].data.value}`,
                                                year: dataCity[i].data.year



                                            })

                                            //console.log(indicator.obj_Variable.name, indicator.obj_Canton.name, value, id_Cities[i]);


                                        }

                                    }

                                }
                            }





                        }
                    }


                }

                if (indicator.obj_Variable.origins[0] && indicator.obj_Variable.origins[0].length !== 0) {
                    origins.push(indicator.obj_Variable.origins[0].name)

                }

                year = dataCity[i].data.year



            }

            let fuente = [];
            fuente = origins.filter((origin, index) => {
                return origins.indexOf(origin) === index;
            });


            /*setTimeout(() => {
                console.log('VAORES', variables.length, id_Cities[i]);

            }, 1000);*/


            if (variables.length > 0) {

                //console.log('TOTAL', value_indicador)
                //console.log('------------------');;

                datas_Variables.push({ data: variables, value: value_indicador, city: id_Cities[l], frecuency: 0, relative: 0, acum: 0, color: '', clasification, year, fuente })


            }




            //console.log('VAORES', variables.length, id_Cities[l], value_indicador);



        }




    }

    /*console.log(datas, rank);*/
    //console.log('-------------------------------------------');


    return datas_Variables




}

async function indexes(clasification, id_cities, years) {

    //console.log(id_cities);


    let data = [];

    let variables = await VariableModel.find({ 'obj_Clasification._id': ObjectId(clasification._id), is_indice: true });

    for (let i = 0; i < variables.length; i++) {








        let values = await intervalo_data(variables[i], id_cities, years);

        if (values) {


            for (const element of values.data) {


                data.push({
                    data: element,
                    rango: values.rango
                });

            }



        }



    }

    //color_data(data, id_cities)

    //console.log(data.length);
    let data_variables = await color_data(data, id_cities, clasification)

    if (data_variables.length > 0) {


        return data_variables;
    }








    /*if (data.length > 0) {
        await console.log('DATAVARIABLE', data.length);

    }*/

    //setTimeout(() => {

    //}, 3000);

    //await color_data(values.rango, values.data, id_cities, variable.code)


    /*let indicators = [];
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

        return { value, indicators };*/

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

function isString(val) {
    return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
}

module.exports = {
    indexes,
    desarrollo_economico,
    servicios_basicos,
    vivienda_y_ambiente,
    gobernanza
}
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


function sendError(res, status, message) {
    return res.status(status).send({
        code: 'ERROR',
        message: message,
        results: {}
    });
}

function sendResponseOk(res, value, message) {
    if (value && value.docs) {
        return res.status(200).send({
            code: 'OK',
            message: message || '',
            results: {
                data: value.docs,
                totalPages: value.totalPages,
                totalDocs: value.totalDocs,
                currentPage: value.page - 1
            }
        });
    }

    return res.status(200).send({
        code: 'OK',
        message: message || '',
        results: {
            data: value
        }
    });
}


function sendResponseCSV(res, value, message) {


    let datoArrayCsv = [];


    var csvWriter = createCsvWriter({
        path: 'files/data.csv',
        header: [
            { id: 'ciudad', title: 'Ciudad' },
            { id: 'ano', title: 'Ano' },
            { id: 'dato', title: 'dato' }
        ]
    });


    for (let index = 0; index < value.docs.length; index++) {

        let ciudad = value.docs[index].obj_Canton.name
        let ano = value.docs[index].year
        let dato = value.docs[index].value

        let datoCSV = {

            ciudad,
            ano,
            dato


        }

        datoArrayCsv.push(datoCSV);



    }


    if (datoArrayCsv) {
        res.status(200).json({
            code: "ok",
            message: "Archivo CSV creado"


        })

        csvWriter
            .writeRecords(datoArrayCsv)
            .then(() => console.log('CSV creado'));


    } else {
        res.status(500).json({
            code: 'false',
            message: 'Error'
        })
    }









    /* if (value && value.docs) {
         return res.status(200).send({
             code: 'OKkk',
             message: message || '',
             results: {
                 data: value.docs,
                 totalPages: value.totalPages,
                 totalDocs: value.totalDocs,
                 currentPage: value.page - 1
             }
         });
     }



     return res.status(200).send({

         code: 'OK',
         message: message || '',
         results: {
             data: value
         }
     });*/
}

module.exports = {
    sendError,
    sendResponseOk,
    sendResponseCSV
}
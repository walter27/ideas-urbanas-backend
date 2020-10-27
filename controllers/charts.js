const { charts } = require('../const/charts');
const fs = require('fs');
const chartExporter = require('highcharts-export-server');
const path = require('path');
const base64Img = require('base64-img');

chartExporter.initPool();

function getChartsTypes(req, res) {

    return res.status(200).send({
        charts
    })
}

async function saveCharts(req, res) {

    let imageb64;
    let image = `${new Date().getMilliseconds()}_${req.body.variable }.png`;
    let pathImage = path.resolve(__dirname, `../share/${image}`)
    chartExporter.export(req.body.options, async(error, res) => {


        //console.log('save image', req.body.options.chart.type);

        if (res) {
            //console.log(req.body);
            imageb64 = await res.data;

        } else {
            console.log(error);
        }


        fs.writeFileSync(pathImage, imageb64, "base64", function(err) {
            if (err) console.log('ERROR', err);
        });
        chartExporter.killPool();

    })



    await res.json({
        ok: true,
        name: image
    });



}




function getImageShare(req, res) {

    let route = path.resolve(__dirname, `../share/${req.params.image}`)
    return res.sendFile(route);

}



module.exports = {
    getChartsTypes,
    saveCharts,
    getImageShare,

}
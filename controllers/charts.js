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

function saveCharts(req, res) {

    let pathImage = path.resolve(__dirname, `../${req.body.options.chart.type }/image.png`)
    chartExporter.export(req.body, (error, res) => {
        let imageb64 = res.data;
        fs.writeFileSync(pathImage, imageb64, "base64", function(err) {
            if (error) console.log(err);
        });
        chartExporter.killPool();

    })

    res.json({
        ok: true,
        img: 'Saved image!',
        route: pathImage
    })

}

function shareChart(req, res) {


    let share = `${req.body.name}_${new Date().getMilliseconds()}`;
    let pathImage = path.resolve(__dirname, `../${req.body.type}/image.png`)
    let pathImageShare = path.resolve(__dirname, `../share/${share}.png`);
    fs.copyFileSync(pathImage, pathImageShare);

    res.json({
        ok: true,
        img: share
    })


}


function getImageShare(req, res) {

    let route = path.resolve(__dirname, `../share/${req.params.image}.png`)
    return res.sendFile(route);

}

function saveImage24(req, res) {

    let pathImage = path.resolve(__dirname, `../${req.body.type}/`)

    //console.log(req.body);
    base64Img.img(req.body.data, pathImage, "image", (err) => {
        if (err) console.log(err);
        res.json({
            ok: true,
            img: 'Saved image!'
        })

    }); // Asynchronous using


    /*let buff = new Buffer(req.body.data, 'base64');
    fs.writeFileSync(pathImage, buff, "base64", function(err) {
        if (err) console.log(err);
        res.json({
            ok: true,
            img: 'Saved image!'
        })
    });*/
}

module.exports = {
    getChartsTypes,
    saveCharts,
    shareChart,
    getImageShare,
    saveImage24

}
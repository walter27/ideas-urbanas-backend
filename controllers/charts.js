const { charts }  = require('../const/charts');

function getChartsTypes(req, res) {

    return res.status(200).send({
        charts
    })
}

module.exports = {
    getChartsTypes
}
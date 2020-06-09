const { category }  = require('../const/category');

function getCategoryTypes(req, res) {

    return res.status(200).send({
        category
    })
}

module.exports = {
    getCategoryTypes
}
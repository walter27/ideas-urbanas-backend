const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express.Router();



app.get('/reportes/:data', (req, res) => {


    let data = req.params.data;

    let pathCSV = path.resolve(__dirname, `../files/${data}`)

    if (fs.existsSync(pathCSV)) {


        res.sendFile(pathCSV)

    } else {

        console.log('no existe');


    }

})

module.exports = app;
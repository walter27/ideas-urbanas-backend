const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express.Router();



app.get('/covid/:data', (req, res) => {


    let data = req.params.data;

    let pathCSV = path.resolve(__dirname, `../files/${data}.json`)

    if (fs.existsSync(pathCSV)) {


        res.sendFile(pathCSV)

    } else {

        console.log('no existe');


    }

})

module.exports = app;
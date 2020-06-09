const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express.Router();



app.get('/datos/:data', (req, res) => {


    let data = req.params.data;

    console.log(data);


    let pathCSV = path.resolve(__dirname, `../files/${data}.csv`)

    console.log(pathCSV);

    if (fs.existsSync(pathCSV)) {

        console.log('EXISTE PATH');

        res.sendFile(pathCSV)

    } else {

        console.log('no existe');


    }

})

module.exports = app;
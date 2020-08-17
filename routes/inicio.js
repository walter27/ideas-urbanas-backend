const express = require('express');
const router = express.Router();
const inicioController = require('../controllers/inicio');

const formidable = require('express-formidable');

router.get('/', inicioController.inicio);
router.get('/images/:id', inicioController.images);
router.get('/logo/:id', inicioController.logo);
router.get('/clasification/:id?', inicioController.getClasifications);
router.get('/variable/:id?', inicioController.getVariables);
router.get('/research/:id?', inicioController.getResearchs);
router.get('/reports/:id?', inicioController.getReports);
router.get('/provincia/:id?', inicioController.getProvincias);
router.get('/canton/:id?', inicioController.getCantons);
router.get('/origin/:id?', inicioController.getOrigins);
router.get('/indicator/:id?', inicioController.getIndicators);
router.get('/years', inicioController.getYears);

router.post('/getVariableByClasification', inicioController.getVariableByClasification);
router.post('/getResearchsByCatAndCant', inicioController.getResearchsByCatAndCant);
router.post('/data', inicioController.getDatas);
router.post('/csv', inicioController.getDatasCSV);
router.post('/covid', inicioController.getDatasCovid);
router.post('/indexes', inicioController.getIndexes);
router.post('/exportdata', inicioController.exportDatas);
router.post('/getTagsByCantByType', inicioController.getTagsByCantByType);
router.post('/addTag', inicioController.addTag);
router.post('/getStopwords', inicioController.getStopwords);

router.post('/loadJSON', formidable(), inicioController.loadJSON);
router.get('/yearsAvailableForVariable/:id', inicioController.getYearsAvailableForVariable);


module.exports = router
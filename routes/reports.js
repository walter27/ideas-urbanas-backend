const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');

const formidable = require('express-formidable');

// Routes of reports
router.post('/', formidable(), reportsController.addReports);
router.delete('/:id', reportsController.deleteReports);
router.put('/:id', formidable(), reportsController.updateReports)

module.exports = router
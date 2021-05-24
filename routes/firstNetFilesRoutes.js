const express = require('express');
const router = express.Router();
const firstNetFilesController = require('../controllers/firstNetFilesController');



router.post('/createSetupFile', firstNetFilesController.createSetupFile);
router.post('/createBiWeeklyPDFFile', firstNetFilesController.createBiWeeklyPDFFile);
router.get('/getCustomerPayments', firstNetFilesController.getCustomerPayments);

module.exports = router;
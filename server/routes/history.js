const express = require('express');
const router  = express.Router();
const { getRuns, getRunById, deleteRun, getComparisons } = require('../controllers/historyController');
router.get('/',                getRuns);
router.get('/runs',            getRuns);
router.get('/runs/:id',        getRunById);
router.delete('/runs/:id',     deleteRun);
router.get('/comparisons',     getComparisons);
module.exports = router;

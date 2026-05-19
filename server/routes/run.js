const express = require('express');
const router  = express.Router();
const { runAlgo } = require('../controllers/runController');
router.post('/', runAlgo);
module.exports = router;

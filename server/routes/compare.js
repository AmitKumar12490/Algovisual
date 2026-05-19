const express = require('express');
const router  = express.Router();
const { compare } = require('../controllers/compareController');
router.post('/', compare);
module.exports = router;

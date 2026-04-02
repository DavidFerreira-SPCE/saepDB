const express = require('express');
const router = express.Router();
const alertsCTRS = require('../controllers/alertsCTRS.js');

router.get('/', alertsCTRS.getAlerts);

module.exports = router;
const express = require('express');
const router = express.Router();
const authCTRS = require('../controllers/authCTRS.js');

router.post('/', authCTRS.login);

module.exports = router;
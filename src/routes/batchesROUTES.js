const express = require('express');
const router = express.Router();
const batchesCTRS = require('../controllers/batchesCTRS.js');

router.get('/', batchesCTRS.getBatches);
router.post('/', batchesCTRS.createBatch);

module.exports = router;
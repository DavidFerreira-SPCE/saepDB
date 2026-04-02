const express = require('express');
const router = express.Router();
const movementsCTRS = require('../controllers/movementsCTRS.js');

router.get('/', movementsCTRS.getMovements);
router.post('/', movementsCTRS.createMovement);

module.exports = router;
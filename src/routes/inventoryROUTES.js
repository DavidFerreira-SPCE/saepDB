const express = require('express');
const router = express.Router();

// Importamos as funções que criamos no Controller
const inventoryCTRS = require('../controllers/inventoryCTRS.js');

// Configuramos as rotas (Note que usamos apenas '/' porque a palavra '/inventory' ficará no server.js)
router.get('/', inventoryCTRS.getInventory);
router.post('/', inventoryCTRS.createInventory);

module.exports = router;
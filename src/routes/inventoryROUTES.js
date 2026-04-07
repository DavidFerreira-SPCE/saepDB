const express = require('express');
const router = express.Router();

// Importamos as funções que criamos no Controller
const inventoryCTRS = require('../controllers/inventoryCTRS.js');

// Configuramos as rotas
router.get('/', inventoryCTRS.getInventory);
router.post('/', inventoryCTRS.createInventory);
router.put('/:id', inventoryCTRS.updateInventory)
router.delete('/:id', inventoryCTRS.deleteInventory);

module.exports = router;
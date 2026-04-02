const express = require('express');
const router = express.Router();
const suppliersCTRS = require('../controllers/suppliersCTRS.js');

router.get('/', suppliersCTRS.getSuppliers);
router.post('/', suppliersCTRS.createSupplier);
router.put('/:id', suppliersCTRS.updateSupplier);
router.delete('/:id', suppliersCTRS.deleteSupplier);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getNearestWarehouseForSeller } = require('../controllers/warehouseController');

router.get('/nearest', getNearestWarehouseForSeller);

module.exports = router;
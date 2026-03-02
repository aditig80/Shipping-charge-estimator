const express = require('express');
const router = express.Router();
const warehouseRoutes = require('./warehouseRoutes');
const shippingRoutes = require('./shippingRoutes');

router.use('/warehouse', warehouseRoutes);
router.use('/shipping-charge', shippingRoutes);

module.exports = router;
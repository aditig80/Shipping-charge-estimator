const express = require('express');
const router = express.Router();
const { getShippingCharge, calculateFullShippingCharge } = require('../controllers/shippingController');

router.get('/', getShippingCharge);
router.post('/calculate', calculateFullShippingCharge);

module.exports = router;
const { Customer, Seller, Product, Warehouse } = require('../models');
const { getNearestWarehouse } = require('../services/warehouseService');
const { calculateShippingCharge } = require('../services/shippingService');
const redisClient = require('../config/redis');
const AppError = require('../utils/AppError');

const VALID_SPEEDS = ['standard', 'express'];

/**
 * GET /api/v1/shipping-charge?warehouseId=&customerId=&deliverySpeed=
 * Calculate charge from a specific warehouse to a customer
 */
const getShippingCharge = async (req, res, next) => {
  try {
    const { warehouseId, customerId, deliverySpeed, productId } = req.query;

    if (!warehouseId || !customerId || !deliverySpeed) {
      throw new AppError('warehouseId, customerId, and deliverySpeed are required', 400);
    }
    if (!VALID_SPEEDS.includes(deliverySpeed)) {
      throw new AppError(`deliverySpeed must be one of: ${VALID_SPEEDS.join(', ')}`, 400);
    }

    // Cache check
    const cacheKey = `shipping_charge:${warehouseId}:${customerId}:${deliverySpeed}:${productId || 'all'}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json({ ...JSON.parse(cached), fromCache: true });

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) throw new AppError(`Warehouse ${warehouseId} not found`, 404);

    const customer = await Customer.findByPk(customerId);
    if (!customer) throw new AppError(`Customer ${customerId} not found`, 404);

    // Use product weight if productId provided, else default to 1kg
    let weightKg = 1;
    if (productId) {
      const product = await Product.findByPk(productId);
      if (!product) throw new AppError(`Product ${productId} not found`, 404);
      weightKg = product.weightKg;
    }

    const result = calculateShippingCharge(
      { lat: warehouse.lat, lng: warehouse.lng },
      { lat: customer.lat, lng: customer.lng },
      weightKg,
      deliverySpeed
    );

    const response = { shippingCharge: result.totalCharge, details: result };

    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));
    res.json(response);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/shipping-charge/calculate
 * Full calculation: seller → nearest warehouse → customer
 */
const calculateFullShippingCharge = async (req, res, next) => {
  try {
    const { sellerId, customerId, productId, deliverySpeed } = req.body;

    if (!sellerId || !customerId || !productId || !deliverySpeed) {
      throw new AppError('sellerId, customerId, productId, and deliverySpeed are required', 400);
    }
    if (!VALID_SPEEDS.includes(deliverySpeed)) {
      throw new AppError(`deliverySpeed must be one of: ${VALID_SPEEDS.join(', ')}`, 400);
    }

    const seller = await Seller.findByPk(sellerId);
    if (!seller) throw new AppError(`Seller ${sellerId} not found`, 404);

    const customer = await Customer.findByPk(customerId);
    if (!customer) throw new AppError(`Customer ${customerId} not found`, 404);

    const product = await Product.findOne({ where: { id: productId, sellerId } });
    if (!product) throw new AppError(`Product ${productId} not found for seller ${sellerId}`, 404);

    // Step 1: Find nearest warehouse to seller
    const { warehouse } = await getNearestWarehouse(seller.lat, seller.lng);

    // Step 2: Calculate shipping from warehouse to customer
    const result = calculateShippingCharge(
      { lat: warehouse.lat, lng: warehouse.lng },
      { lat: customer.lat, lng: customer.lng },
      product.weightKg,
      deliverySpeed
    );

    res.json({
      shippingCharge: result.totalCharge,
      nearestWarehouse: {
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        warehouseLocation: { lat: warehouse.lat, lng: warehouse.lng },
      },
      details: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getShippingCharge, calculateFullShippingCharge };
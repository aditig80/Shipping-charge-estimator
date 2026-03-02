const { Seller, Product } = require('../models');
const { getNearestWarehouse } = require('../services/warehouseService');
const redisClient = require('../config/redis');
const AppError = require('../utils/AppError');

/**
 * GET /api/v1/warehouse/nearest?sellerId=&productId=
 * Returns the nearest warehouse for a seller's product
 */
const getNearestWarehouseForSeller = async (req, res, next) => {
  try {
    const { sellerId, productId } = req.query;

    // Validate params
    if (!sellerId || !productId) {
      throw new AppError('sellerId and productId are required', 400);
    }

    // Check Redis cache first
    const cacheKey = `nearest_warehouse:${sellerId}:${productId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ ...JSON.parse(cached), fromCache: true });
    }

    // Find seller
    const seller = await Seller.findByPk(sellerId);
    if (!seller) throw new AppError(`Seller ${sellerId} not found`, 404);

    // Find product (ensure it belongs to seller)
    const product = await Product.findOne({ where: { id: productId, sellerId } });
    if (!product) throw new AppError(`Product ${productId} not found for seller ${sellerId}`, 404);

    // Get nearest warehouse
    const { warehouse, distanceKm } = await getNearestWarehouse(seller.lat, seller.lng);

    const response = {
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      warehouseLocation: { lat: warehouse.lat, lng: warehouse.lng },
      distanceFromSellerKm: parseFloat(distanceKm.toFixed(2)),
    };

    // Cache for 10 minutes (warehouse locations don't change often)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(response));

    res.json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = { getNearestWarehouseForSeller };
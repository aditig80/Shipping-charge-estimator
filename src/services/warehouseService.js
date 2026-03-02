const { Warehouse } = require('../models');
const { getDistanceKm } = require('./distanceService');
const AppError = require('../utils/AppError');

/**
 * Find the nearest active warehouse to a given lat/lng point
 */
const getNearestWarehouse = async (lat, lng) => {
  const warehouses = await Warehouse.findAll({ where: { isActive: true } });

  if (!warehouses.length) {
    throw new AppError('No warehouses available', 404);
  }

  // Calculate distance to each warehouse and pick the closest
  let nearest = null;
  let minDistance = Infinity;

  for (const wh of warehouses) {
    const dist = getDistanceKm({ lat, lng }, { lat: wh.lat, lng: wh.lng });
    if (dist < minDistance) {
      minDistance = dist;
      nearest = wh;
    }
  }

  return { warehouse: nearest, distanceKm: minDistance };
};

module.exports = { getNearestWarehouse };
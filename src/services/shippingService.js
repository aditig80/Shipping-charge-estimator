const { getDistanceKm, getTransportMode } = require('./distanceService');

const STANDARD_COURIER_CHARGE = 10;
const EXPRESS_EXTRA_PER_KG = 1.2;

/**
 * Delivery speed strategy pattern
 * Each speed returns total charge based on base shipping cost
 */
const deliverySpeedStrategies = {
  standard: (baseCharge) => {
    return STANDARD_COURIER_CHARGE + baseCharge;
  },
  express: (baseCharge, weightKg) => {
    return STANDARD_COURIER_CHARGE + (EXPRESS_EXTRA_PER_KG * weightKg) + baseCharge;
  },
};

/**
 * Calculate shipping charge
 * @param {Object} warehouseLocation - { lat, lng }
 * @param {Object} customerLocation  - { lat, lng }
 * @param {number} weightKg          - total weight of order
 * @param {string} deliverySpeed     - 'standard' | 'express'
 */
const calculateShippingCharge = (warehouseLocation, customerLocation, weightKg, deliverySpeed) => {
  const distanceKm = getDistanceKm(warehouseLocation, customerLocation);
  const { mode, ratePerKmPerKg } = getTransportMode(distanceKm);

  // Base charge = distance * weight * rate
  const baseCharge = distanceKm * weightKg * ratePerKmPerKg;

  const strategy = deliverySpeedStrategies[deliverySpeed];
  if (!strategy) {
    throw new Error(`Unsupported delivery speed: ${deliverySpeed}`);
  }

  const totalCharge = strategy(baseCharge, weightKg);

  return {
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    transportMode: mode,
    baseCharge: parseFloat(baseCharge.toFixed(2)),
    totalCharge: parseFloat(totalCharge.toFixed(2)),
    deliverySpeed,
    weightKg,
  };
};

module.exports = { calculateShippingCharge };
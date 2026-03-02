const haversine = require('haversine-distance');

/**
 * Calculate distance in KM between two lat/lng points
 */
const getDistanceKm = (point1, point2) => {
  // haversine returns meters, convert to km
  const meters = haversine(point1, point2);
  return meters / 1000;
};

/**
 * Determine transport mode based on distance
 * Strategy Pattern: easy to add new modes
 */
const getTransportMode = (distanceKm) => {
  if (distanceKm >= 500) return { mode: 'Aeroplane', ratePerKmPerKg: 1 };
  if (distanceKm >= 100) return { mode: 'Truck', ratePerKmPerKg: 2 };
  return { mode: 'Mini Van', ratePerKmPerKg: 3 };
};

module.exports = { getDistanceKm, getTransportMode };
const createGeoJSONPoint = (coordinates) => ({
  type: 'Point',
  coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
});

const validateCoordinates = (coordinates) => {
  const [lng, lat] = coordinates;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw new Error('Invalid coordinates');
  }
  return true;
};

const calculateDistance = (point1, point2) => {
  // Haversine formula
  const R = 6371e3; // Earth radius in meters
  const φ1 = (point1[1] * Math.PI) / 180;
  const φ2 = (point2[1] * Math.PI) / 180;
  const Δφ = ((point2[1] - point1[1]) * Math.PI) / 180;
  const Δλ = ((point2[0] - point1[0]) * Math.PI) / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
};

module.exports = {
  createGeoJSONPoint,
  validateCoordinates,
  calculateDistance
};
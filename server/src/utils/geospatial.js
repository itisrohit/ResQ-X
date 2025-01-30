export const createGeoJSONPoint = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new Error('Invalid coordinates: must be an array of length 2');
  }
  const [lng, lat] = coordinates;
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    throw new Error('Invalid coordinates: both values must be numbers');
  }
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw new Error('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180');
  }
  return {
    type: 'Point',
    coordinates: [parseFloat(lng), parseFloat(lat)]
  };
};


export const validateCoordinates = (coordinates) => {
  try {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      throw new Error('Invalid coordinates: must be an array of length 2');
    }
    const [lng, lat] = coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number') {
      throw new Error('Invalid coordinates: both values must be numbers');
    }
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180');
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};



export const calculateDistance = (point1, point2) => {
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

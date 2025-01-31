import axios from 'axios';
import { createGeoJSONPoint } from '../utils/geospatial.js';

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (!response.data.results.length) {
      throw new Error('No results found');
    }

    const { lng, lat } = response.data.results[0].geometry.location;
    return createGeoJSONPoint([lng, lat]);
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

export const getDirections = async (origin, destination) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${origin[1]},${origin[0]}`,
        destination: `${destination[1]},${destination[0]}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
        mode: 'driving'
      }
    });

    if (!response.data.routes.length) {
      throw new Error('No route found');
    }

    return {
      polyline: response.data.routes[0].overview_polyline.points,
      distance: response.data.routes[0].legs[0].distance,
      duration: response.data.routes[0].legs[0].duration
    };
  } catch (error) {
    throw new Error(`Directions failed: ${error.message}`);
  }
};

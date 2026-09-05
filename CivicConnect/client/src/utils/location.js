export const getLocationLabel = (location, locationName, fallback = 'Location unavailable') => {
  if (typeof locationName === 'string' && locationName.trim()) return locationName;
  if (typeof location === 'string' && location.trim()) return location;

  if (location?.coordinates?.length >= 2) {
    const [longitude, latitude] = location.coordinates;
    return `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`;
  }

  return fallback;
};

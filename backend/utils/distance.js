function haversineDistance(coord1, coord2) {
    const lat1 = toRadians(coord1.lat);
    const lon1 = toRadians(coord1.long);
    const lat2 = toRadians(coord2.lat);
    const lon2 = toRadians(coord2.long);
  
    const R = 6371; // Earth's radius in kilometers
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  const toRadians = (degrees) => degrees * (Math.PI / 180);

    module.exports = { haversineDistance };
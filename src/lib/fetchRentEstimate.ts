export async function fetchRentEstimate(city: string) {
  const response = await fetch(`/api/rentEstimate?city=${encodeURIComponent(city)}`);
  if (!response.ok) throw new Error('Failed to fetch rent estimate');
  const data = await response.json();
  // Use the same extraction logic as before
  const medianRent = data.medianRent || data.rent || data.price || data.median || 0;
  return {
    medianRent,
    lastUpdated: new Date().toISOString(),
  };
} 
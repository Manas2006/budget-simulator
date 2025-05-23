export async function fetchCityCostOfLiving(lat: number, lon: number) {
  const response = await fetch(`/api/rentEstimate?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
  if (!response.ok) throw new Error('Failed to fetch cost of living data');
  const data = await response.json();
  return data;
} 
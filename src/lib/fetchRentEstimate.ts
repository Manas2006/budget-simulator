export async function fetchCityCostOfLiving(city_name: string, country_name: string) {
  const response = await fetch(`/api/rentEstimate?city_name=${encodeURIComponent(city_name)}&country_name=${encodeURIComponent(country_name)}`);
  if (!response.ok) throw new Error('Failed to fetch cost of living data');
  const data = await response.json();
  return data;
} 
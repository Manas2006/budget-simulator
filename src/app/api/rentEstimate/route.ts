import { NextRequest } from 'next/server';
import axios from 'axios';

type CityCostOfLivingData = {
  name: string;
  country: string;
  cost_of_living_index: number;
  rent_index: number;
  groceries_index: number;
  restaurant_price_index: number;
  local_purchasing_power_index: number;
  cost_of_living_details: { currency: string; details: { Item: string; Value: string | number }[] }[];
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: 'Latitude and longitude are required' }), { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_RAPIDAPI_KEY) {
    console.error('NEXT_PUBLIC_RAPIDAPI_KEY is missing from environment variables!');
    return new Response(JSON.stringify({ error: 'API key missing' }), { status: 500 });
  }

  const encodedParams = new URLSearchParams();
  encodedParams.set('latitude', lat);
  encodedParams.set('longitude', lon);
  encodedParams.set('currencies', '["USD"]');
  encodedParams.set('radius', '100');
  encodedParams.set('distance_unit', 'kilometers');

  const options = {
    method: 'POST',
    url: 'https://cities-cost-of-living1.p.rapidapi.com/dev/get_cities_details_by_coordinates',
    headers: {
      'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
      'x-rapidapi-host': 'cities-cost-of-living1.p.rapidapi.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    const city: CityCostOfLivingData = response.data.data[0];
    const usdDetails = city.cost_of_living_details.find((d) => d.currency === 'USD')?.details || [];
    const getItem = (label: string) => usdDetails.find((item) => item.Item === label)?.Value ?? 'N/A';

    const result = {
      city: city.name,
      country: city.country,
      costOfLivingIndex: city.cost_of_living_index,
      rentIndex: city.rent_index,
      groceriesIndex: city.groceries_index,
      restaurantIndex: city.restaurant_price_index,
      purchasingPower: city.local_purchasing_power_index,
      estMonthlyWithoutRent: getItem('Estimated Monthly Costs Without Rent'),
      apt1City: getItem('Apartment (1 bedroom) in City Centre'),
      apt1Suburbs: getItem('Apartment (1 bedroom) Outside of Centre'),
      apt3City: getItem('Apartment (3 bedrooms) in City Centre'),
      apt3Suburbs: getItem('Apartment (3 bedrooms) Outside of Centre'),
      avgSalary: getItem('Average Monthly Net Salary (After Tax)'),
      internetCost: getItem('Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)'),
    };
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching city cost of living:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cost of living data' }), { status: 500 });
  }
} 
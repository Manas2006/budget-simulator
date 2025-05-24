import { NextRequest } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/data.json');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city_name = searchParams.get('city_name');
  const country_name = searchParams.get('country_name');

  if (!city_name || !country_name) {
    return new Response(JSON.stringify({ error: 'city_name and country_name are required' }), { status: 400 });
  }

  // Read or create the cache file
  let cache: Record<string, unknown> = {};
  if (fs.existsSync(DATA_PATH)) {
    try {
      cache = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    } catch {
      cache = {};
    }
  }

  const cacheKey = `${city_name.toLowerCase()},${country_name.toLowerCase()}`;
  if (cache[cacheKey]) {
    return new Response(JSON.stringify(cache[cacheKey]), { status: 200 });
  }

  if (!process.env.NEXT_PUBLIC_RAPIDAPI_KEY) {
    return new Response(JSON.stringify({ error: 'API key missing' }), { status: 500 });
  }

  const options = {
    method: 'GET',
    url: 'https://cost-of-living-and-prices.p.rapidapi.com/prices',
    params: {
      city_name,
      country_name,
    },
    headers: {
      'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
      'x-rapidapi-host': 'cost-of-living-and-prices.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const result = response.data;
    // Cache the result
    cache[cacheKey] = result;
    fs.writeFileSync(DATA_PATH, JSON.stringify(cache, null, 2), 'utf-8');
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching city cost of living:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cost of living data' }), { status: 500 });
  }
} 
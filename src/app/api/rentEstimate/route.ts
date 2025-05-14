import { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  console.log('API route called with city:', city);

  if (!city) {
    return new Response(JSON.stringify({ error: 'City is required' }), { status: 400 });
  }

  if (!process.env.RAPIDAPI_ZILLOW_KEY) {
    console.error('RAPIDAPI_ZILLOW_KEY is missing from environment variables!');
    return new Response(JSON.stringify({ error: 'API key missing' }), { status: 500 });
  }

  try {
    const dummyAddress = ` ${city}`;
    const options = {
      method: 'GET',
      url: 'https://zillow-com1.p.rapidapi.com/rentEstimate',
      params: {
        address: dummyAddress,
        d: '0.5',
        propertyType: 'SingleFamily'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_ZILLOW_KEY!,
        'x-rapidapi-host': 'zillow-com1.p.rapidapi.com'
      }
    };
    console.log('Axios request options:', JSON.stringify({ ...options, headers: { ...options.headers, 'x-rapidapi-key': '***' } }, null, 2));
    const response = await axios.request(options);
    console.log('Zillow API response:', response.data);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error: any) {
    console.error('Zillow API error:', error?.response?.data || error.message || error);
    return new Response(JSON.stringify({ error: error.message, details: error?.response?.data }), { status: 500 });
  }
} 
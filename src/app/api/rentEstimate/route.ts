import { NextRequest } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Use /tmp for cache in production, src/data/data.json in dev
const DATA_PATH = process.env.NODE_ENV === 'production'
  ? '/tmp/data.json'
  : path.join(process.cwd(), 'src/data/data.json');

// Supabase Storage configow 
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = 'city-cache';
const STORAGE_FILE = 'data.json';




// Type guard for error.status === 404
function isStatus404(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && (error as { status: number }).status === 404;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city_name = searchParams.get('city_name');
  const country_name = searchParams.get('country_name');

  if (!city_name || !country_name) {
    return new Response(JSON.stringify({ error: 'city_name and country_name are required' }), { status: 400 });
  }

  // Restore cache from Supabase if missing (awaited)
  if (process.env.NODE_ENV === 'production' && !fs.existsSync(DATA_PATH)) {
    const { data, error } = await supabase.storage.from(BUCKET).download(STORAGE_FILE);
    if (data) {
      const buffer = Buffer.from(await data.arrayBuffer());
      fs.writeFileSync(DATA_PATH, buffer);
      console.log('✅ Restored cache from Supabase Storage');
    } else if (isStatus404(error)) {
      fs.writeFileSync(DATA_PATH, '{}');
      console.log('ℹ️ No cache found in Supabase Storage, created new empty cache');
    } else if (error) {
      console.error('❌ Error downloading cache from Supabase:', error);
      return new Response(JSON.stringify({ error: 'Failed to restore cache from Supabase' }), { status: 500 });
    }
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

  // Only check for API key if we need to fetch new data
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

    // Upload updated cache to Supabase Storage (production only)
    if (process.env.NODE_ENV === 'production') {
      try {
        const fileBuffer = fs.readFileSync(DATA_PATH);
        const { data, error } = await supabase.storage.from(BUCKET).upload(STORAGE_FILE, fileBuffer, {
          upsert: true,
          contentType: 'application/json',
        });
        if (error) {
          console.error('❌ Error uploading cache to Supabase:', error);
        } else {
          console.log('Cache uploaded to Supabase!', data);
        }
      } catch (err) {
        console.error('❌ Error uploading cache to Supabase:', err);
      }
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching city cost of living:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cost of living data' }), { status: 500 });
  }
} 
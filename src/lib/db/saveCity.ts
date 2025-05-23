import { supabase } from '@/lib/supabaseClient';

export async function saveCity(city: {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  rent: number;
}) {
  const { error } = await supabase.from('saved_cities').insert({
    city_slug: city.slug,
    city_name: city.name,
    lat: city.lat,
    lon: city.lon,
    rent_snapshot: city.rent
  });
  return error;
} 
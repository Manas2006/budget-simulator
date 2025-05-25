import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from './useUser';

export type SavedCity = {
  id: string;
  user_id: string;
  city_slug: string;
  city_name: string;
  country_name: string;
  lat: number;
  lon: number;
  rent_snapshot: number;
  snapshot: unknown;
  created_at: string;
};

export function useSavedCities() {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    if (!user) {
      setSavedCities([]);
      setLoading(false);
      return;
    }

    const fetchSavedCities = async () => {
      const { data, error } = await supabase
        .from('saved_cities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved cities:', error);
        return;
      }

      setSavedCities(data || []);
      setLoading(false);
    };

    fetchSavedCities();

    // Subscribe to changes
    const channel = supabase
      .channel('saved_cities_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_cities',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSavedCities((prev) => [payload.new as SavedCity, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setSavedCities((prev) => prev.filter((city) => city.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const saveCity = async (cityData: Omit<SavedCity, 'id' | 'user_id' | 'created_at' | 'city_slug'>) => {
    if (!user) return null;

    const citySlug = `${cityData.city_name.toLowerCase().replace(/\s+/g, '-')}-${cityData.country_name.toLowerCase().replace(/\s+/g, '-')}`;

    // Debug: log the data being sent
    console.log('Saving city with data:', {
      user_id: user.id,
      city_slug: citySlug,
      ...cityData,
    });

    const { data, error } = await supabase
      .from('saved_cities')
      .upsert(
        {
          user_id: user.id,
          city_slug: citySlug,
          ...cityData,
        },
        {
          onConflict: 'user_id,city_slug',
        }
      )
      .select()
      .single();

    // Debug: log the full Supabase response
    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Error saving city:', error);
      return null;
    }

    // Optimistically update savedCities
    if (data) {
      setSavedCities(prev => {
        // Replace if exists, otherwise add
        const exists = prev.find(c => c.city_slug === data.city_slug && c.user_id === data.user_id);
        if (exists) {
          return prev.map(c => (c.city_slug === data.city_slug && c.user_id === data.user_id ? data : c));
        } else {
          return [data, ...prev];
        }
      });
    }

    return data;
  };

  const removeCity = async (cityId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('saved_cities')
      .delete()
      .eq('id', cityId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing city:', error);
      return false;
    }

    // Optimistically update savedCities
    setSavedCities(prev => prev.filter(city => city.id !== cityId));

    return true;
  };

  return {
    savedCities,
    loading,
    saveCity,
    removeCity,
  };
} 
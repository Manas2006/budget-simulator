"use client";

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
// import CityPopupCard from '@/components/CityPopupCard';
import { fetchCityCostOfLiving } from '@/lib/fetchRentEstimate';
import Link from 'next/link';
import CursorHalo from './CursorHalo';
import CityCostCard from '@/components/CityCostCard';
import { SavedCitiesProvider } from '@/hooks/SavedCitiesContext';

type CityCostOfLivingData = {
  city_name: string;
  country_name: string;
  prices: Array<{
    item_name: string;
    category_name: string;
    usd: { avg: string };
  }>;
};

const USMap = dynamic(() => import('@/components/USMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-xl">Loading map...</div>
    </div>
  ),
});

export default function RentMapPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityData, setCityData] = useState<CityCostOfLivingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const rentCache = useRef<{ [key: string]: CityCostOfLivingData }>({});

  const handleCityClick = async (city: { name: string; lat: number; lon: number }) => {
    setSelectedCity(city.name);
    if (rentCache.current[city.name]) {
      setCityData(rentCache.current[city.name]);
      return;
    }
    setIsLoading(true);
    try {
      // Parse city and state from city.name (e.g., "Austin, TX")
      const [cityPart] = city.name.split(',');
      const city_name = cityPart.trim();
      const country_name = 'United States';
      const result = await fetchCityCostOfLiving(city_name, country_name);
      setCityData(result);
      rentCache.current[city.name] = result;
    } catch {
      setCityData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCard = () => {
    setSelectedCity(null);
    setCityData(null);
  };

  return (
    <SavedCitiesProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col font-sans">
        <CursorHalo color="green" />
        <Link href="/" className="fixed top-6 left-6 z-50 bg-white/90 text-emerald-700 hover:bg-emerald-50 border border-emerald-400 rounded-full px-5 py-2 shadow-md text-lg font-medium transition-all hover:scale-105 cursor-pointer">
          ← Home
        </Link>
        <main className="flex-1 flex flex-col items-center justify-center px-0 pb-0">
          <USMap onCityClick={handleCityClick} recenterButtonClass="fixed bottom-6 right-6 z-50 bg-white/90 text-emerald-700 hover:bg-emerald-50 border border-emerald-400 rounded-full px-5 py-2 shadow-md text-lg font-medium transition-all hover:scale-105 cursor-pointer" />
          {selectedCity && cityData && (
            <CityCostCard data={cityData} onClose={handleCloseCard} />
          )}
          {isLoading && (
            <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-emerald-200 z-50">
              Loading cost of living data...
            </div>
          )}
        </main>
      </div>
    </SavedCitiesProvider>
  );
} 
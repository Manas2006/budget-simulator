'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import CityPopupCard from '@/components/CityPopupCard';
import { fetchRentEstimate } from '@/lib/fetchRentEstimate';
import Link from 'next/link';
import CursorHalo from './rent-map/CursorHalo';

// Dynamically import the map component to avoid SSR issues with Mapbox
const USMap = dynamic(() => import('@/components/USMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-xl">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [rentData, setRentData] = useState<{
    rent: number | null;
    lastUpdated: string | null;
  }>({ rent: null, lastUpdated: null });
  const [isLoading, setIsLoading] = useState(false);
  const rentCache = useRef<{ [city: string]: { rent: number | null; lastUpdated: string | null } }>({});

  const handleCityClick = async (city: string) => {
    setSelectedCity(city);

    // Check cache first
    if (rentCache.current[city]) {
      setRentData(rentCache.current[city]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchRentEstimate(city);
      const data = {
        rent: result?.medianRent || null,
        lastUpdated: result?.lastUpdated || null,
      };
      setRentData(data);
      rentCache.current[city] = data; // Store in cache
    } catch (error) {
      console.error('Error fetching rent data:', error);
      setRentData({ rent: null, lastUpdated: null });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCard = () => {
    setSelectedCity(null);
    setRentData({ rent: null, lastUpdated: null });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-200 via-lime-100 to-green-50 font-sans relative">
      <CursorHalo color="green" />
      <div className="max-w-xl w-full flex flex-col items-center justify-center px-4 py-16 z-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-green-900 mb-6 tracking-tight text-center">Budget Simulator</h1>
        <p className="text-lg sm:text-xl text-green-700 mb-12 text-center font-light">Explore US cities and compare rent costs with a beautiful, interactive map. Plan your next move with confidence.</p>
        <Link href="/rent-map">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-xl font-semibold shadow-lg border border-emerald-600 hover:scale-105 transition-transform cursor-pointer hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400">Rent Map</button>
        </Link>
      </div>
    </div>
  );
}

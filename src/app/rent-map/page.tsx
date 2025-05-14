"use client";

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import CityPopupCard from '@/components/CityPopupCard';
import { fetchRentEstimate } from '@/lib/fetchRentEstimate';
import Link from 'next/link';
import CursorHalo from './CursorHalo';
import { motion } from 'framer-motion';

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
  const [rentData, setRentData] = useState<{
    rent: number | null;
    lastUpdated: string | null;
  }>({ rent: null, lastUpdated: null });
  const [isLoading, setIsLoading] = useState(false);
  const rentCache = useRef<{ [city: string]: { rent: number | null; lastUpdated: string | null } }>({});

  const handleCityClick = async (city: string) => {
    setSelectedCity(city);
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
      rentCache.current[city] = data;
    } catch (error) {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col font-sans"
    >
      <CursorHalo color="green" />
      <Link href="/" className="fixed top-6 left-6 z-50 bg-white/90 text-emerald-700 hover:bg-emerald-50 border border-emerald-400 rounded-full px-5 py-2 shadow-md text-lg font-medium transition-all hover:scale-105 cursor-pointer">
        ← Home
      </Link>
      <main className="flex-1 flex flex-col items-center justify-center px-0 pb-0">
        <USMap onCityClick={handleCityClick} recenterButtonClass="fixed bottom-6 right-6 z-50 bg-white/90 text-emerald-700 hover:bg-emerald-50 border border-emerald-400 rounded-full px-5 py-2 shadow-md text-lg font-medium transition-all hover:scale-105 cursor-pointer" />
        {selectedCity && (
          <CityPopupCard
            city={selectedCity}
            rent={rentData.rent}
            lastUpdated={rentData.lastUpdated}
            onClose={handleCloseCard}
          />
        )}
        {isLoading && (
          <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-emerald-200 z-50">
            Loading rent data...
          </div>
        )}
      </main>
    </motion.div>
  );
} 
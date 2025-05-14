"use client";

import { useEffect } from 'react';

interface CityPopupCardProps {
  city: string;
  rent: number | null;
  lastUpdated: string | null;
  onClose: () => void;
}

export default function CityPopupCard({ city, rent, lastUpdated, onClose }: CityPopupCardProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{city}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Median Rent</h3>
            {rent ? (
              <p className="text-2xl font-bold text-blue-600">
                ${rent.toLocaleString()}/mo
              </p>
            ) : (
              <p className="text-gray-500">Data unavailable</p>
            )}
          </div>

          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 
'use client';

import React from 'react';
import { format } from 'date-fns';

type SavedCity = {
  city_name: string;
  rent_snapshot: number;
  created_at: string;
};

type Props = {
  savedCities: SavedCity[];
};

const DashboardStats: React.FC<Props> = ({ savedCities }) => {
  if (!savedCities.length) return null;

  const totalCities = savedCities.length;
  const averageRent =
    savedCities.reduce((acc, city) => acc + city.rent_snapshot, 0) /
    totalCities;

  const mostExpensive = savedCities.reduce((prev, curr) =>
    curr.rent_snapshot > prev.rent_snapshot ? curr : prev
  );
  const cheapest = savedCities.reduce((prev, curr) =>
    curr.rent_snapshot < prev.rent_snapshot ? curr : prev
  );

  const latestSaved = savedCities
    .map((c) => new Date(c.created_at))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-2 text-emerald-800">Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div className="text-gray-800">🏙️ Total Cities: <strong className="font-semibold">{totalCities}</strong></div>
        <div className="text-gray-800">💰 Avg Rent: <strong className="font-semibold">{formatCurrency(averageRent)}/mo</strong></div>
        <div className="text-gray-800">📈 Most Expensive: <strong className="font-semibold">{mostExpensive.city_name} ({formatCurrency(mostExpensive.rent_snapshot)}/mo)</strong></div>
        <div className="text-gray-800">📉 Cheapest: <strong className="font-semibold">{cheapest.city_name} ({formatCurrency(cheapest.rent_snapshot)}/mo)</strong></div>
        <div className="text-gray-800">📊 Rent Range: <strong className="font-semibold">{formatCurrency(cheapest.rent_snapshot)} - {formatCurrency(mostExpensive.rent_snapshot)}</strong></div>
        <div className="text-gray-800">🕒 Last Saved: <strong className="font-semibold">{format(latestSaved, 'PPP')}</strong></div>
      </div>
    </div>
  );
};

export default DashboardStats; 
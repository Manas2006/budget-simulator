import React from 'react';

type CityCostOfLivingData = {
  city: string;
  country: string;
  costOfLivingIndex: number;
  rentIndex: number;
  groceriesIndex: number;
  restaurantIndex: number;
  purchasingPower: number;
  estMonthlyWithoutRent: string | number;
  apt1City: string | number;
  apt1Suburbs: string | number;
  apt3City: string | number;
  apt3Suburbs: string | number;
  avgSalary: string | number;
  internetCost: string | number;
};

type CityCostCardProps = {
  data: CityCostOfLivingData;
  onClose: () => void;
}

const formatCurrency = (value: string | number) => {
  if (value === 'N/A' || value === undefined || value === null) return 'N/A';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return 'N/A';
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

export default function CityCostCard({ data, onClose }: CityCostCardProps) {
  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-emerald-100/80 to-lime-100/80 backdrop-blur-md shadow-2xl border-l border-emerald-200 z-50 flex flex-col">
      <div className="relative p-6 flex-1 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">
          {data.city}, {data.country}
        </h2>
        <div className="mb-4 text-sm text-gray-500">Cost of Living Index: <span className="font-semibold text-emerald-700">{data.costOfLivingIndex ?? 'N/A'}</span></div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between">
              <span>Rent Index:</span>
              <span className="font-semibold">{data.rentIndex ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Groceries Index:</span>
              <span className="font-semibold">{data.groceriesIndex ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Restaurant Price Index:</span>
              <span className="font-semibold">{data.restaurantIndex ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Purchasing Power:</span>
              <span className="font-semibold">{data.purchasingPower ?? 'N/A'}</span>
            </div>
          </div>
          <hr className="my-2 border-emerald-200" />
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between">
              <span>Est. Monthly Costs (No Rent):</span>
              <span className="font-semibold">{formatCurrency(data.estMonthlyWithoutRent)}</span>
            </div>
            <div className="flex justify-between">
              <span>1BR Apt (City Centre):</span>
              <span className="font-semibold">{formatCurrency(data.apt1City)}</span>
            </div>
            <div className="flex justify-between">
              <span>1BR Apt (Suburbs):</span>
              <span className="font-semibold">{formatCurrency(data.apt1Suburbs)}</span>
            </div>
            <div className="flex justify-between">
              <span>3BR Apt (City Centre):</span>
              <span className="font-semibold">{formatCurrency(data.apt3City)}</span>
            </div>
            <div className="flex justify-between">
              <span>3BR Apt (Suburbs):</span>
              <span className="font-semibold">{formatCurrency(data.apt3Suburbs)}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Net Salary:</span>
              <span className="font-semibold">{formatCurrency(data.avgSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span>Internet (60 Mbps+):</span>
              <span className="font-semibold">{formatCurrency(data.internetCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
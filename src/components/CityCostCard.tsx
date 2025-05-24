import React from 'react';

type PriceItem = {
  item_name: string;
  category_name: string;
  usd: { avg: string };
};

type CityCostOfLivingData = {
  city_name: string;
  country_name: string;
  prices: PriceItem[];
};

type CityCostCardProps = {
  data: CityCostOfLivingData;
  onClose: () => void;
};

const formatCurrency = (value: string | undefined | null) => {
  if (!value || value === 'N/A') return 'N/A';
  const num = parseFloat(value);
  if (isNaN(num)) return 'N/A';
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const CATEGORY_MAP: Record<string, { label: string; icon: string; bg: string }> = {
  'Rent Per Month': { label: '🏠 Rent', icon: '🏠', bg: 'bg-emerald-50' },
  'Markets': { label: '🛒 Groceries', icon: '🛒', bg: 'bg-lime-50' },
  'Restaurants': { label: '🍽 Restaurants', icon: '🍽', bg: 'bg-orange-50' },
  'Transportation': { label: '🚇 Transportation', icon: '🚇', bg: 'bg-blue-50' },
  'Utilities Per Month': { label: '💡 Utilities', icon: '💡', bg: 'bg-yellow-50' },
  'Sports And Leisure': { label: '🎟 Leisure', icon: '🎟', bg: 'bg-purple-50' },
  'Salaries And Financing': { label: '💵 Salary', icon: '💵', bg: 'bg-pink-50' },
};

const CATEGORY_ORDER = [
  'Rent Per Month',
  'Markets',
  'Restaurants',
  'Transportation',
  'Utilities Per Month',
  'Sports And Leisure',
  'Salaries And Financing',
];

export default function CityCostCard({ data, onClose }: CityCostCardProps) {
  // Group prices by category
  const grouped: Record<string, PriceItem[]> = {};
  data.prices.forEach(item => {
    if (!grouped[item.category_name]) grouped[item.category_name] = [];
    grouped[item.category_name].push(item);
  });

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-emerald-100/80 to-lime-100/80 backdrop-blur-md shadow-2xl border-l border-emerald-200 z-50 flex flex-col text-black">
      <div className="relative p-6 flex-1 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-emerald-800 mb-6">
          Cost of Living in {data.city_name}, {data.country_name}
        </h2>
        <div className="space-y-6">
          {CATEGORY_ORDER.map(cat =>
            grouped[cat] ? (
              <section
                key={cat}
                className={`rounded-2xl p-4 shadow-md ${CATEGORY_MAP[cat]?.bg || 'bg-white/60'}`}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">{CATEGORY_MAP[cat]?.icon}</span>
                  <h3 className="text-lg font-semibold text-emerald-700">{CATEGORY_MAP[cat]?.label || cat}</h3>
                </div>
                <div className="divide-y divide-emerald-100">
                  {grouped[cat].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.item_name}</div>
                        <div className="text-xs text-gray-400">{item.category_name}</div>
                      </div>
                      <div className="text-base font-bold text-emerald-900">{formatCurrency(item.usd?.avg)}</div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
} 
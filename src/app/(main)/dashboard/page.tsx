'use client';

import { SavedCitiesProvider, useSavedCitiesContext } from '@/hooks/SavedCitiesContext';
import CityCard from '@/components/CityCard';
import { useUser } from '@/hooks/useUser';

function DashboardContent() {
  const { savedCities, loading } = useSavedCitiesContext();
  const user = useUser();

  // Debug: log savedCities on every render
  console.log('Dashboard savedCities:', savedCities);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-emerald-800 mb-6">Your Cities</h1>
          <p className="text-gray-600">Please sign in to view your saved cities.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-emerald-800 mb-6">Your Cities</h1>
          <p className="text-gray-600">Loading your cities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Your Cities</h1>
        
        {savedCities.length === 0 ? (
          <p className="text-gray-600">You haven&apos;t saved any cities yet. Explore the rent map to add cities to your dashboard.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SavedCitiesProvider>
      <DashboardContent />
    </SavedCitiesProvider>
  );
} 
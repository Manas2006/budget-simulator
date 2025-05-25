import { Trash2 } from 'lucide-react';
import { useSavedCitiesContext } from '@/hooks/SavedCitiesContext';

interface CityCardProps {
  city: {
    id: string;
    city_name: string;
    rent_snapshot: number;
    created_at: string;
  };
}

export default function CityCard({ city }: CityCardProps) {
  const { removeCity } = useSavedCitiesContext();

  const handleRemove = async () => {
    await removeCity(city.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{city.city_name}</h3>
      <p className="text-2xl font-bold text-emerald-600 mb-2">
        ${city.rent_snapshot.toLocaleString()}/mo
      </p>
      <p className="text-sm text-gray-500">
        Saved on {new Date(city.created_at).toLocaleDateString()}
      </p>
      <button
        onClick={handleRemove}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
        aria-label="Remove City"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
} 
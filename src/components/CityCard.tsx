interface CityCardProps {
  city: {
    city_name: string;
    rent_snapshot: number;
    created_at: string;
  };
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{city.city_name}</h3>
      <p className="text-2xl font-bold text-emerald-600 mb-2">
        ${city.rent_snapshot.toLocaleString()}/mo
      </p>
      <p className="text-sm text-gray-500">
        Saved on {new Date(city.created_at).toLocaleDateString()}
      </p>
    </div>
  );
} 
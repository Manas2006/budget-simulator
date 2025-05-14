"use client";
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import cities from '@/data/usCities.json';

interface USMapProps {
  onCityClick: (city: string) => void;
  recenterButtonClass?: string;
}

const INITIAL_CENTER: [number, number] = [-98.5795, 39.8283];
const INITIAL_ZOOM = 3;

export default function USMap({ onCityClick, recenterButtonClass }: USMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredCoords, setHoveredCoords] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMarker, setSearchMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Track if the user has moved the map
    map.current.on('move', () => {
      setHasMoved(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Add markers for each city
    cities.forEach(city => {
      const el = document.createElement('div');
      el.className = 'city-marker';
      el.innerHTML = '📍';
      el.style.cursor = 'pointer';
      el.style.fontSize = '28px';
      el.style.background = 'none';
      el.style.border = 'none';
      el.style.boxShadow = 'none';
      el.style.padding = '0';
      el.style.width = 'auto';
      el.style.height = 'auto';
      el.addEventListener('mouseenter', () => {
        setHoveredCity(city.name);
        setHoveredCoords([city.lon, city.lat]);
      });
      el.addEventListener('mouseleave', () => {
        setHoveredCity(null);
        setHoveredCoords(null);
      });
      el.addEventListener('click', () => {
        onCityClick(city.name);
      });
      new mapboxgl.Marker(el)
        .setLngLat([city.lon, city.lat])
        .addTo(map.current!);
    });
  }, [mapLoaded, onCityClick]);

  const handleSearch = async (e: React.FormEvent) => {
    console.log('handleSearch called');
    e.preventDefault();
    console.log('Search query:', searchQuery);
    
    if (!searchQuery.trim()) {
      console.log('Empty search query, returning');
      return;
    }

    // Try to find an exact match first
    let city = cities.find(c => 
      c.name.toLowerCase() === searchQuery.toLowerCase()
    );
    console.log('Exact match found:', city?.name);

    // If no exact match, try partial match
    if (!city) {
      city = cities.find(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('Partial match found:', city?.name);
    }
    
    if (!city && map.current) {
      console.log('City not in database, attempting to geocode');
      try {
        // Use Mapbox Geocoding API to get coordinates
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}&types=place&country=US`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lon, lat] = data.features[0].center;
          const cityName = data.features[0].text;
          console.log('Geocoded city:', cityName, 'at', lat, lon);
          
          // Remove existing search marker if any
          searchMarker?.remove();
          
          // Create and add new red pin marker
          const el = document.createElement('div');
          el.className = 'search-marker';
          el.innerHTML = '📍';
          el.style.cursor = 'pointer';
          el.style.fontSize = '32px';
          el.style.color = '#ef4444'; // red-500
          el.style.background = 'none';
          el.style.border = 'none';
          el.style.boxShadow = 'none';
          el.style.padding = '0';
          el.style.width = 'auto';
          el.style.height = 'auto';
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat([lon, lat])
            .addTo(map.current);
          
          setSearchMarker(marker);
          
          // Fly to the city
          map.current.flyTo({
            center: [lon, lat],
            zoom: 10,
            duration: 2000
          });
          
          // Trigger the city click to show rent data
          console.log('Calling onCityClick with:', cityName);
          onCityClick(cityName);
          
          // Clear the search input
          setSearchQuery('');
        } else {
          console.log('No results found for:', searchQuery);
          alert('City not found. Please try a different city name.');
        }
      } catch (error) {
        console.error('Error geocoding city:', error);
        alert('Error finding city. Please try again.');
      }
    } else if (city && map.current) {
      console.log('City found in database, proceeding with marker and zoom');
      // Remove existing search marker if any
      searchMarker?.remove();
      
      // Create and add new red pin marker
      const el = document.createElement('div');
      el.className = 'search-marker';
      el.innerHTML = '📍';
      el.style.cursor = 'pointer';
      el.style.fontSize = '32px';
      el.style.color = '#ef4444'; // red-500
      el.style.background = 'none';
      el.style.border = 'none';
      el.style.boxShadow = 'none';
      el.style.padding = '0';
      el.style.width = 'auto';
      el.style.height = 'auto';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([city.lon, city.lat])
        .addTo(map.current);
      
      setSearchMarker(marker);
      
      // Fly to the city
      map.current.flyTo({
        center: [city.lon, city.lat],
        zoom: 10,
        duration: 2000
      });
      
      // Trigger the city click to show rent data
      console.log('Calling onCityClick with:', city.name);
      onCityClick(city.name);
      
      // Clear the search input
      setSearchQuery('');
    } else {
      console.log('No city found or map not initialized');
      if (!city) console.log('City not found in database');
      if (!map.current) console.log('Map not initialized');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter') {
      console.log('Enter key detected, preventing default and calling handleSearch');
      e.preventDefault();
      handleSearch(e);
    }
  };

  // Recenter the map to the initial US view
  const handleRecenter = () => {
    if (map.current) {
      map.current.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, speed: 1.2 });
      setHasMoved(false);
      searchMarker?.remove();
      setSearchMarker(null);
    }
  };

  // Render tooltip for hovered city
  const renderTooltip = () => {
    if (!hoveredCity || !hoveredCoords || !map.current) return null;
    const point = map.current.project(hoveredCoords);
    return (
      <div
        className="pointer-events-none fixed z-50"
        style={{ left: point.x, top: point.y - 40 }}
      >
        <div className="bg-white/90 text-blue-700 text-sm font-semibold px-3 py-1 rounded-xl shadow-lg border border-blue-200 animate-fade-in">
          {hoveredCity}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <div className="fixed top-6 left-0 right-0 flex justify-center z-50">
        <form 
          onSubmit={(e) => {
            console.log('Form submitted');
            handleSearch(e);
          }} 
          className="w-[350px]"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                console.log('Input changed:', e.target.value);
                setSearchQuery(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search for a city..."
              className="w-full bg-white/90 text-emerald-700 border border-emerald-400 rounded-full px-6 py-3 shadow-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            <button
              type="submit"
              onClick={() => console.log('Search button clicked')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-700 hover:text-emerald-800"
            >
              🔍
            </button>
          </div>
        </form>
      </div>
      <div ref={mapContainer} className="w-full h-full" />
      {renderTooltip()}
      {hasMoved && (
        <button
          onClick={handleRecenter}
          className={recenterButtonClass || "fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-500 text-white px-5 py-3 rounded-full shadow-xl border border-white/70 hover:scale-105 transition-all z-50"}
        >
          Recenter US
        </button>
      )}
    </div>
  );
} 
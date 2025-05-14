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

  // Recenter the map to the initial US view
  const handleRecenter = () => {
    if (map.current) {
      map.current.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, speed: 1.2 });
      setHasMoved(false);
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
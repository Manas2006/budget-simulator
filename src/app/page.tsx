import Link from 'next/link';
import CursorHalo from './rent-map/CursorHalo';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-200 via-lime-100 to-green-50 font-sans relative">
      <CursorHalo color="green" />
      <div className="max-w-xl w-full flex flex-col items-center justify-center px-4 py-16 z-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-green-900 mb-6 tracking-tight text-center">Budget Simulator</h1>
        <p className="text-lg sm:text-xl text-green-700 mb-12 text-center font-light">Explore US cities and compare rent costs with a beautiful, interactive map. Plan your next move with confidence.</p>
        <Link href="/rent-map">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-xl font-semibold shadow-lg border border-emerald-600 hover:scale-105 transition-transform cursor-pointer hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400">Rent Map</button>
        </Link>
      </div>
    </div>
  );
}

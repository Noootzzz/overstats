import { useState, useEffect } from 'react';
import Header from "../components/Header";
import { MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

/* eslint react/prop-types: 0 */  //NE PAS ENLEVER

const MapCard = ({ map, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/90 cursor-pointer"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 rounded-lg filter blur-sm"></div>
        <img 
          src={map.screenshot} 
          alt={map.name} 
          className="w-full h-48 object-cover rounded-lg relative z-10"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-200 mt-4">{map.name}</h3>
      <div className="flex items-center gap-2 text-gray-400 mt-2">
        <MapPin className="w-4 h-4" />
        <span>{map.location}</span>
      </div>
    </div>
  );
};

const MapDetails = ({ map, onClose }) => {
  if (!map) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={map.screenshot} 
            alt={map.name} 
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-900/80 p-2 rounded-full hover:bg-gray-800/80 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-200 mb-4">{map.name}</h2>
          
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span>Location: {map.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span>Game Modes: {map.gamemodes.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Maps() {
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameMode, setSelectedGameMode] = useState("");

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await fetch('https://overfast-api.tekrop.fr/maps');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch maps');
        }
        
        setMaps(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  const filteredMaps = maps.filter(map => 
    (map.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedGameMode ? map.gamemodes.includes(selectedGameMode) : true)
  );
  

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden z-30">
      <Header />
      <Link 
          to="/" 
          className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 rounded-lg transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 absolute top-4 left-4 z-50"
        >
          <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to home</span>
      </Link>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-[60%] -right-[20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-[20%] left-[60%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[96px]" />
      </div>

      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]" />

      <main className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-200">
            Search for an         <span className="px-2 text-4xl sm:px-2 md:px-3 bg-red-700 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg">Overwatch Maps</span>            !
          </h1>


          <div className="mb-8 flex items-center gap-4">
            <input
              type="text"
              placeholder="Search maps by name or location..."
              className="w-full px-4 py-3 bg-gray-800/40 text-gray-200 placeholder-gray-400 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              value={selectedGameMode} 
              onChange={(e) => setSelectedGameMode(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-800/40 text-gray-200 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">All Game Modes</option>
              <option value="assault">Assault</option>
              <option value="control">Control</option>
              <option value="escort">Escort</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center text-red-400">
              Error: {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaps.map(map => (
              <MapCard 
                key={map.name} 
                map={map} 
                onClick={() => setSelectedMap(map)}
              />
            ))}
          </div>
        </div>
      </main>

      {selectedMap && (
        <MapDetails 
          map={selectedMap} 
          onClose={() => setSelectedMap(null)}
        />
      )}
    </div>
  );
}
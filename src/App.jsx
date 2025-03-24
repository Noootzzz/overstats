import { useState } from 'react'; 
import Header from './components/Header'; 
import RotatingText from './components/RotatingText'; 
import GradientText from './components/GradientText';
import { Search, AlertCircle } from 'lucide-react';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchPlayer = async (e) => { 
    e.preventDefault(); 
    if (!playerName.trim()) return;
    
    setLoading(true); 
    setError(null); 
    try { 
      const formattedPlayerName = playerName.replace('#', '-'); 
      const response = await fetch(`https://overfast-api.tekrop.fr/players/${formattedPlayerName}`); 
      const data = await response.json();
     
      if (!response.ok) { 
        throw new Error(data.message || 'Player not found!');
      }
      const baseUrl = window.location.hostname === 'localhost' ? '' : 'overstats-six.vercel.app';
      window.location.href = `${baseUrl}/players/${formattedPlayerName}`;
    } catch (err) { 
      setError(err.message);
    } finally { 
      setLoading(false); 
    } 
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Effets de lueur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-[60%] -right-[20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-[20%] left-[60%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[96px]" />
      </div>

      {/* Overlay glassmorphism */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]" />

      {/* Contenu */}
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-16 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center flex flex-col items-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                  OverStats
                </h1>
                <div className="h-16">
                  <RotatingText
                    texts={['Player', 'Info', 'Career', 'Maps']}
                    mainClassName="px-3 text-3xl bg-gradient-to-r from-red-600 to-red-800 text-white overflow-hidden py-2 rounded-lg shadow-lg shadow-red-500/20"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.015}
                    splitLevelClassName="overflow-hidden"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </div>
              </div>
              
              <p className="flex text-xl text-gray-300 items-center">
                Don&apos;t forget to set your career to 
                <GradientText
                  colors={["#ef4444", "#ffffff", "#9ca3af"]}
                  animationSpeed={1}
                  showBorder={false}
                  className="mx-1 font-semibold mr-2 ml-2"
                >
                  Public
                </GradientText>
                !
              </p>
            </div>

            {/* Formulaire de recherche */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={searchPlayer} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter BattleTag (e.g., Player#12345)"
                    className="w-full pl-11 pr-4 py-3 bg-gray-800/40 text-gray-200 placeholder-gray-400 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !playerName.trim()}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-lg transition-all duration-300 backdrop-blur-sm ${
                      loading || !playerName.trim()
                        ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600/80 to-red-800/80 text-white hover:from-red-700/90 hover:to-red-900/90 hover:shadow-lg hover:shadow-red-500/20'
                    }`}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </form>

              {/* Instructions */}
              <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">How to find your BattleTag?</h2>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-500">1.</span>
                    Open Battle.net and log into your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-500">2.</span>
                    Click on your username in the top-right corner
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-500">3.</span>
                    Your BattleTag will be displayed as &quot;Username#1234&quot;
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

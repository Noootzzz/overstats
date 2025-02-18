import { useState } from 'react'; 
import Header from './components/Header'; 
import RotatingText from './components/RotatingText'; 
import GradientText from './components/GradientText';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchPlayer = async (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    setError(null); 
    try { 
      const formattedPlayerName = playerName.replace('#', '-'); 
      const response = await fetch(`https://overfast-api.tekrop.fr/players/${formattedPlayerName}`); 
      const data = await response.json();
     
      if (!response.ok) { 
        throw new Error(data.message || 'Player not found!'); // Gérer les erreurs 
      }
      // Rediriger vers la page du joueur avec l'ID dans l'URL
      // Utilisez un historique ou un environnement router ici pour changer l'URL
      window.location.href = `/players/${formattedPlayerName}`; // Remplacez par le bon ID
    } catch (err) { 
      setError(err.message); // Affiche l’erreur si elle existe 
    } finally { 
      setLoading(false); 
    } 
  };

  // Formulaire de recherche du joueur
  return (
    <>
      <Header />
      <main className="container mx-auto px-4">
        <div className='flex w-full justify-center items-center'>
          <h1 className='mr-5 text-4xl'>OverStats</h1>
          <RotatingText
            texts={['Player', 'Info', 'Career', 'Maps']}
            mainClassName="px-2 text-4xl sm:px-2 md:px-3 bg-red-700 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.015}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
        <div className='w-full flex justify-center items-center mt-2'>
          <h3 className='flex text-2xl'>
            Don&apos;t forget to put your career in
            <GradientText
              colors={["red", "white, grey"]}
              animationSpeed={1}
              showBorder={false}
              className="ml-2"
            >
              Public
            </GradientText>
            !
          </h3>
        </div>
        <div className="mt-8 max-w-xl mx-auto">
          <form onSubmit={searchPlayer} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter BattleTag (e.g., Player#12345)"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react'
import Header from "../components/Header"
import { MapPin, Calendar, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const HeroCard = ({ hero, onClick }) => {
    return (
      <div 
        onClick={onClick}
        className="bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/90 cursor-pointer w-full"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-lg filter blur-sm"></div>
          <img src={hero.portrait} alt={hero.name} className="w-full h-48 object-cover rounded-lg relative z-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-200 mt-4">{hero.name}</h3>
      </div>
    );
};

const HeroDetails = ({ hero, onClose }) => {
    const [heroDetails, setHeroDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAbility, setSelectedAbility] = useState(null);
    const videoRefs = useRef({});
  
    useEffect(() => {
      const fetchHeroDetails = async () => {
        try {
          const response = await fetch(`https://overfast-api.tekrop.fr/heroes/${hero.key}`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch hero details');
          }
          
          setHeroDetails(data);
          // Select the first ability by default if available
          if (data.abilities && data.abilities.length > 0) {
            setSelectedAbility(data.abilities[0]);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchHeroDetails();
    }, [hero.key]);

    // Effect to preload videos when hero details are loaded
    useEffect(() => {
      if (heroDetails?.abilities && heroDetails.abilities.length > 0) {
        // Preload all videos
        heroDetails.abilities.forEach(ability => {
          if (ability.video?.link) {
            const videoElement = document.createElement('video');
            videoElement.preload = 'auto';
            
            // Add sources to the video element
            const sourceMP4 = document.createElement('source');
            sourceMP4.src = ability.video.link.mp4;
            sourceMP4.type = 'video/mp4';
            videoElement.appendChild(sourceMP4);
            
            const sourceWebM = document.createElement('source');
            sourceWebM.src = ability.video.link.webm;
            sourceWebM.type = 'video/webm';
            videoElement.appendChild(sourceWebM);
            
            // Store the preloaded video element
            videoRefs.current[ability.name] = videoElement;
          }
        });
      }
    }, [heroDetails]);
  
    if (!hero) return null;
  
    // Function to handle ability selection and play video
    const handleAbilitySelect = (ability) => {
      setSelectedAbility(ability);
      
      // Play the video immediately after selection
      setTimeout(() => {
        const videoElement = document.querySelector(".ability-video");
        if (videoElement) {
          videoElement.load();
          videoElement.play().catch(e => console.log("Auto-play prevented:", e));
        }
      }, 50);
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <img 
              src={hero.portrait} 
              alt={hero.name} 
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
            <h2 className="text-3xl font-bold text-gray-200 mb-4">{hero.name}</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center text-red-400">
                Error: {error}
              </div>
            ) : heroDetails && (
              <>
                <p className="text-gray-300 mb-6">{heroDetails.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-200 mb-3">Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <span>Location: {heroDetails.location || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <span>Age: {heroDetails.age || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-5 h-5 text-pink-400" />
                        <span>Birthday: {heroDetails.birthday || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-200 mb-3">Hit Points</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Heart className="w-5 h-5 text-red-400" />
                        <span>Health: {heroDetails.hitpoints?.health || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Heart className="w-5 h-5 text-yellow-400" />
                        <span>Armor: {heroDetails.hitpoints?.armor || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Heart className="w-5 h-5 text-blue-400" />
                        <span>Shields: {heroDetails.hitpoints?.shields || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Heart className="w-5 h-5 text-purple-400" />
                        <span>Total: {heroDetails.hitpoints?.total || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Abilities section */}
                {heroDetails.abilities && heroDetails.abilities.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-200 mb-4">Abilities</h3>
                    
                    {/* Ability selector */}
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                      {heroDetails.abilities.map((ability, index) => (
                        <button
                          key={index}
                          onClick={() => handleAbilitySelect(ability)}
                          className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 border ${
                            selectedAbility === ability 
                              ? 'border-red-500 bg-red-500/20' 
                              : 'border-gray-700 bg-gray-800/60 hover:bg-gray-700/60'
                          }`}
                        >
                          <img 
                            src={ability.icon} 
                            alt={ability.name} 
                            className="w-12 h-12 object-contain"
                          />
                        </button>
                      ))}
                    </div>
                    
                    {/* Selected ability details */}
                    {selectedAbility && (
                      <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-start gap-4">
                          <img 
                            src={selectedAbility.icon} 
                            alt={selectedAbility.name} 
                            className="w-16 h-16 object-contain"
                          />
                          <div>
                            <h4 className="text-lg font-bold text-gray-200">{selectedAbility.name}</h4>
                            <p className="text-gray-300 mt-1">{selectedAbility.description}</p>
                          </div>
                        </div>
                        
                        {/* Ability video */}
                        {selectedAbility.video && (
                          <div className="mt-4">
                            <div className="relative rounded-lg overflow-hidden aspect-video">
                              <video 
                                poster={selectedAbility.video.thumbnail} 
                                controls
                                preload="auto"
                                className="w-full ability-video"
                                key={selectedAbility.name} // Force re-render when ability changes
                              >
                                <source src={selectedAbility.video.link.mp4} type="video/mp4" />
                                <source src={selectedAbility.video.link.webm} type="video/webm" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Hidden video preloading elements */}
                <div className="hidden">
                  {heroDetails.abilities && heroDetails.abilities.map((ability, index) => (
                    ability.video && (
                      <video 
                        key={`preload-${ability.name}`} 
                        preload="auto" 
                        muted 
                        playsInline
                      >
                        <source src={ability.video.link.mp4} type="video/mp4" />
                        <source src={ability.video.link.webm} type="video/webm" />
                      </video>
                    )
                  ))}
                </div>
                
                {/* Story section */}
                {heroDetails.story && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-200 mb-3">Story</h3>
                    <p className="text-gray-300 mb-4">{heroDetails.story.summary}</p>
                    
                    {/* Story chapters if available */}
                    {heroDetails.story.chapters && heroDetails.story.chapters.length > 0 && (
                      <div className="mt-4 space-y-6">
                        {heroDetails.story.chapters.map((chapter, index) => (
                          <div key={index} className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                            <h4 className="text-lg font-bold text-gray-200 mb-2">{chapter.title}</h4>
                            <p className="text-gray-300 mb-4">{chapter.content}</p>
                            {chapter.picture && (
                              <img 
                                src={chapter.picture} 
                                alt={chapter.title} 
                                className="w-full rounded-lg"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Story media if available */}
                    {heroDetails.story.media && heroDetails.story.media.type === 'video' && (
                      <div className="mt-4">
                        <a 
                          href={heroDetails.story.media.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                          </svg>
                          Watch Story Video
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
};

export default function Heroes() {
    const [heroesData, setHeroesData] = useState({ Tank: [], Damage: [], Support: [] });
    const [roleIcons, setRoleIcons] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHero, setSelectedHero] = useState(null);
    
    const fetchHeroes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://overfast-api.tekrop.fr/heroes?locale=en-us`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Fetch Heroes error!');
            }
            
            // Trier les héros par rôle
            const sortedHeroes = {
                Tank: data.filter(hero => hero.role === "tank"),
                Damage: data.filter(hero => hero.role === "damage"),
                Support: data.filter(hero => hero.role === "support"),
            };

            setHeroesData(sortedHeroes);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchIcons = async () => {
        try {
            const response = await fetch(`https://overfast-api.tekrop.fr/roles?locale=en-us`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Fetch Roles Icons error!');
            }

            // Transformer le tableau en un objet clé-valeur
            const iconsMap = data.reduce((acc, role) => {
                acc[role.name] = role.icon;
                return acc;
            }, {});

            setRoleIcons(iconsMap);
        } catch (err) {
            setError(err.message);
        }
    };

    // useEffect pour charger les héros et les icônes au chargement de la page
    useEffect(() => {
        fetchHeroes();
        fetchIcons();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

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
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-200">
                        Search for an <span className="px-2 text-4xl sm:px-2 md:px-3 bg-red-700 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg">Overwatch hero</span> !
                    </h1>

                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Search heroes by name..."
                            className="w-full px-4 py-3 bg-gray-800/40 text-gray-200 placeholder-gray-400 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Display loading state */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                        </div>
                    )}
                        
                    {/* Display error message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center text-red-400">
                            Error: {error}
                        </div>
                    )}
                    
                    {/* Display heroes sorted by role */}
                    <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-20">
                        {["Tank", "Damage", "Support"].map(role => (
                            <div key={role} className="w-full">
                                <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                                    {roleIcons[role] ? <img src={roleIcons[role]} alt={role} className="w-8 h-8" /> : null}
                                    {role}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
                                {heroesData[role]
                                    .filter(hero => hero.name.toLowerCase().includes(searchQuery))
                                    .map(hero => (
                                        <HeroCard 
                                            key={hero.key} 
                                            hero={hero} 
                                            onClick={() => setSelectedHero(hero)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </main>

            {selectedHero && (
                <HeroDetails 
                    hero={selectedHero} 
                    onClose={() => setSelectedHero(null)}
                />
            )}
        </div>
    );
}
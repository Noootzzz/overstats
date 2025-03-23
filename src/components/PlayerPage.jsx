import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import PlayerStats from './PlayerStats';
import { Trophy, Clock, Swords, CircleDivide, Home } from 'lucide-react';

/* eslint react/prop-types: 0 */  //NE PAS ENLEVER

const RankDisplay = ({ role, roleData }) => {
  return (
    <div className="flex items-center mt-2 bg-gray-800/80 p-3 rounded-xl hover:bg-gray-700/90 transition-all duration-300 transform hover:scale-102 backdrop-blur-sm border border-gray-700/50">
      <div className="flex items-center w-28 mr-5">
        <img 
          src={roleData?.role_icon || `/roles/${role}.svg`} 
          alt={`${role} icon`} 
          className="w-10 h-10 filter drop-shadow-lg" 
        />
        <span className="ml-3 capitalize text-gray-200 font-medium">{role}</span>
      </div>
      
      {roleData ? (
        <div className="flex items-center">
          <img 
            src={roleData.rank_icon} 
            alt="Rank icon" 
            className="w-12 h-auto filter drop-shadow-lg" 
          />
          <div className="ml-3">
            <span className="text-gray-200 font-semibold">
              {roleData.tier}
            </span>
          </div>
        </div>
      ) : (
        <span className="text-gray-400 ml-3 font-medium">
          Unranked
        </span>
      )}
    </div>
  );
};

const CompetitiveRanks = ({ playerData }) => {
  const roles = ['support', 'damage', 'tank'];
  
  return (
    <div className="mt-6 w-full space-y-3">
      <h3 className="text-xl font-bold mb-4 text-gray-200">Competitive Ranks</h3>
      {roles.map(role => (
        <RankDisplay 
          key={role}
          role={role}
          roleData={playerData.summary?.competitive?.pc?.[role]}
        />
      ))}
    </div>
  );
};

const HeroCard = ({ title, heroData, heroesInfo }) => {
  const hero = heroesInfo?.find(h => h.key === heroData?.hero.toLowerCase());
  
  return (
    <div className="bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/90">
      <h3 className="text-xl font-bold mb-4 text-gray-200">{title}</h3>
      <div className="flex items-center">
        {hero && (
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-md"></div>
            <img 
              src={hero.portrait} 
              alt={hero.name} 
              className="w-16 h-16 rounded-full mr-4 relative z-10 border-2 border-gray-700/50"
            />
          </div>
        )}
        <div>
          <p className="capitalize text-lg font-semibold text-gray-200">{heroData?.hero}</p>
          <p className="text-gray-400 mt-1">
            {title === 'Most Played Hero' 
              ? `${Math.floor(heroData?.value / 3600)} hours ${Math.floor((heroData?.value % 3600) / 60)} minutes`
              : `${heroData?.value}%`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

const getNextBestHero = (heroes, excludeValue = 100) => {
  if (!heroes || heroes.length === 0) return null;
  
  const sortedHeroes = [...heroes].filter(hero => hero.value !== excludeValue).sort((a, b) => b.value - a.value);
  
  return sortedHeroes.length ? sortedHeroes[0] : null;
};

const BestHistoricalRank = ({ playerData }) => {
  const roles = ['support', 'damage', 'tank'];
  const bestRanks = roles.map(role => {
    const seasonHistory = playerData.summary?.competitive?.pc?.[role]?.season_history || [];
    if (seasonHistory.length === 0) return null;
    

    const bestRank = [...seasonHistory].sort((a, b) => {
      const tierOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'TOP_500'];
      return tierOrder.indexOf(b.tier) - tierOrder.indexOf(a.tier);
    })[0];

    return {
      role,
      ...bestRank
    };
  }).filter(Boolean);

  if (bestRanks.length === 0) return null;

  return (
    <div className="bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50 mt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-200 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Best Historical Ranks
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bestRanks.map((rank) => (
          <div key={rank.role} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center gap-3">
              <img 
                src={`/roles/${rank.role}.svg`}
                alt={rank.role}
                className="w-8 h-8"
              />
              <div>
                <p className="capitalize text-gray-200 font-medium">{rank.role}</p>
                <p className="text-gray-400">Season {rank.season}</p>
              </div>
            </div>
            <div className="flex items-center mt-3">
              <img 
                src={rank.rank_icon} 
                alt={rank.tier} 
                className="w-12 h-12"
              />
              <span className="ml-3 text-gray-200 font-semibold">{rank.tier}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroDetailedStats = ({ heroData, heroInfo }) => {
  if (!heroData || !heroInfo) return null;

  const stats = heroData;
  
  if (!stats) return null;

  const winRate = stats.win_percentage.toFixed(1);

  const eliminationsPerLife = stats.eliminations_per_life.toFixed(2);

  const kda = stats.eliminations_per_life.toFixed(2);

  return (
    <div className="bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50 transform transition-all duration-300 hover:bg-gray-700/90">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-md"></div>
          <img 
            src={heroInfo.portrait} 
            alt={heroInfo.name} 
            className="w-16 h-16 rounded-full relative z-10 border-2 border-gray-700/50"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-200">{heroInfo.name}</h3>
          <p className="text-gray-400">{heroInfo.role}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-sm text-gray-400">Win Rate</span>
          </div>
          <p className="text-lg font-semibold text-gray-200">
            {winRate}%
          </p>
        </div>
        
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm text-gray-400">Time Played</span>
          </div>
          <p className="text-lg font-semibold text-gray-200">
            {Math.floor((stats.time_played || 0) / 3600)}h
          </p>
        </div>
        
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Swords className="w-4 h-4" />
            <span className="text-sm text-gray-400">Eliminations/Life</span>
          </div>
          <p className="text-lg font-semibold text-gray-200">
            {eliminationsPerLife}
          </p>
        </div>
        
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <CircleDivide className="w-4 h-4" />
            <span className="text-sm text-gray-400">KDA</span>
          </div>
          <p className="text-lg font-semibold text-gray-200">
            {kda}
          </p>
        </div>
      </div>
    </div>
  );
};

const PlayerPage = () => {
  const { playerId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [heroStats, setHeroStats] = useState(null);
  const [heroesInfo, setHeroesInfo] = useState([]);
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);
  const [heroDetailedStats, setHeroDetailedStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHeroesInfo = async () => {
      try {
        const response = await fetch('https://overfast-api.tekrop.fr/heroes?locale=en-us');
        const data = await response.json();
        setHeroesInfo(data);
      } catch (err) {
        setError('Failed to load heroes information');
        console.error(err);
      }
    };

    fetchHeroesInfo();
  }, []);

  useEffect(() => {
    const fetchHeroStats = async () => {
      if (!playerId || !selectedHero || !playerData) return;

      try {
        const competitiveComparisons = playerData.stats?.pc?.competitive?.heroes_comparisons;
        const quickplayComparisons = playerData.stats?.pc?.quickplay?.heroes_comparisons;
        
        const findHeroStats = (comparisons, heroKey) => {
          if (!comparisons) return null;
          
          const timePlayed = comparisons.time_played?.values?.find(h => h.hero.toLowerCase() === heroKey)?.value || 0;
          const gamesWon = comparisons.games_won?.values?.find(h => h.hero.toLowerCase() === heroKey)?.value || 0;
          const gamesPlayed = comparisons.games_played?.values?.find(h => h.hero.toLowerCase() === heroKey)?.value || 0;
          const eliminations = comparisons.eliminations?.values?.find(h => h.hero.toLowerCase() === heroKey)?.value || 0;
          const deaths = comparisons.deaths?.values?.find(h => h.hero.toLowerCase() === heroKey)?.value || 0;
          const eliminationsPerLife = comparisons.eliminations_per_life?.values?.find(h => h.hero.toLowerCase() === heroKey)?.value || 0;
          const winPercentage = comparisons.win_percentage?.values?.find(h => h.hero.toLowerCase() === heroKey)?.value || 0;

          return {
            hero: heroKey,
            time_played: timePlayed,
            games_won: gamesWon,
            games_played: gamesPlayed,
            eliminations: eliminations,
            deaths: deaths,
            eliminations_per_life: eliminationsPerLife,
            win_percentage: winPercentage
          };
        };

        const heroStats = findHeroStats(competitiveComparisons, selectedHero) || 
                         findHeroStats(quickplayComparisons, selectedHero);

        if (heroStats) {
          console.log('Found hero stats:', heroStats);
          setHeroDetailedStats(heroStats);
        } else {
          console.log('No stats found for hero:', selectedHero);
          setHeroDetailedStats(null);
        }
        
      } catch (err) {
        console.error('Failed to process hero stats:', err);
        setHeroDetailedStats(null);
      }
    };

    fetchHeroStats();
  }, [playerId, selectedHero, playerData]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const normalizedPlayerId = playerId.replace('#', '-');
        const response = await fetch(`https://overfast-api.tekrop.fr/players/${normalizedPlayerId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Player not found!');
        }

        setPlayerData(data);

        if (data.stats?.pc?.competitive?.heroes_comparisons) {
          const comparisons = data.stats.pc.competitive.heroes_comparisons;
          
          const stats = {
            mostPlayed: comparisons.time_played?.values?.[0],
            highestWinRate: getNextBestHero(
              comparisons.win_percentage?.values.filter(hero => hero.value > 0)
            ),
            bestAccuracy: getNextBestHero(
              comparisons.weapon_accuracy_best_in_game?.values
            ),
            killsPerLife: getNextBestHero(
              comparisons.eliminations_per_life?.values
            ),
          };
          setHeroStats(stats);
        }
      } catch (err) {
        setError('Failed to fetch player data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (playerId) {
      fetchPlayerData();
    }
  }, [playerId]);

  const filteredHeroes = (role) => {
    return heroesInfo
      .filter(hero => hero.role === role)
      .filter(hero => 
        hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hero.key.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 mt-8 text-center">Loading... please wait.</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 rounded-lg transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to home</span>
          </Link>
          
          <div className="relative w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search heroes..."
              className="w-full px-4 py-2 bg-gray-900/90 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm border border-gray-700/50 shadow-xl shadow-black/20 transition-all duration-300 hover:shadow-blue-500/10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
          <div className="flex flex-col md:flex-row items-start gap-6 p-8 relative z-20"
            style={{
              backgroundImage: playerData?.summary?.namecard ? `url(${playerData.summary.namecard})` : 'none',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-lg transform group-hover:scale-110 transition-transform duration-300"></div>
              <img 
                src={playerData.summary.avatar} 
                alt={`${playerData.summary.username}'s avatar`} 
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-700/50 relative z-10 transform group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-200 drop-shadow-lg">{playerData.summary.username}</h2>
                {playerData.summary.title && (
                  <p className="text-xl text-gray-300 mt-2 drop-shadow">{playerData.summary.title}</p>
                )}
              </div>

              <div className="flex items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full filter blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                  <img 
                    src={playerData.summary.endorsement.frame} 
                    alt="Endorsement level" 
                    className="w-14 h-14 relative z-10 transform group-hover:rotate-180 transition-all duration-500"
                  />
                </div>
                <span className="ml-4 text-lg font-medium text-gray-200 drop-shadow">Level {playerData.summary.endorsement.level}</span>
              </div>

              <CompetitiveRanks playerData={playerData} />
            </div>
          </div>
        </div>

        {/* Meilleurs rangs historiques */}
        <BestHistoricalRank playerData={playerData} />

        {/* Statistiques des héros */}
        {heroStats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HeroCard 
                title="Most Played Hero" 
                heroData={heroStats.mostPlayed}
                heroesInfo={heroesInfo}
              />
              <HeroCard 
                title="Highest Win Rate" 
                heroData={heroStats.highestWinRate}
                heroesInfo={heroesInfo}
              />
              <HeroCard 
                title="Best Accuracy" 
                heroData={heroStats.bestAccuracy}
                heroesInfo={heroesInfo}
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-200 border-b border-gray-700/50 pb-2">Hero Detailed Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Colonnes des héros avec effet de survol amélioré */}
                {["tank", "damage", "support"].map((role) => (
                  <div key={role} className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex items-center gap-3 mb-6">
                      <img src={`/img/roles/${role}.svg`} alt={role} className="w-8 h-8" />
                      <h4 className="text-xl font-semibold text-gray-200 capitalize">{role}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {filteredHeroes(role).map(hero => (
                        <button
                          key={hero.key}
                          onClick={() => setSelectedHero(hero.key)}
                          className={`group p-3 rounded-lg transition-all duration-300 ${
                            selectedHero === hero.key 
                              ? 'bg-gray-700/90 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                              : 'bg-gray-800/80 hover:bg-gray-700/70 border-2 border-transparent hover:border-gray-600/50'
                          }`}
                        >
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full filter blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                            <img 
                              src={hero.portrait} 
                              alt={hero.name}
                              className="w-16 h-16 rounded-full mx-auto relative z-10 transform group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-center text-sm text-gray-200 mt-3 font-medium group-hover:text-gray-100">{hero.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Statistiques détaillées du héros */}
              {selectedHero && heroDetailedStats && (
                <div className="mt-8 transform transition-all duration-500">
                  <HeroDetailedStats 
                    heroData={heroDetailedStats} 
                    heroInfo={heroesInfo.find(h => h.key === selectedHero)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistiques du joueur */}
        {!isLoading && !error && (
          <div className="mt-8">
            <PlayerStats playerId={playerId} />
          </div>
        )}
      </div>
    </div>
  );
};

PlayerPage.propTypes = {
  playerData: PropTypes.shape({
    summary: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.string,
      namecard: PropTypes.string,
      title: PropTypes.string,
      endorsement: PropTypes.shape({
        level: PropTypes.number,
        frame: PropTypes.string,
      }),
      competitive: PropTypes.shape({
        pc: PropTypes.shape({
          support: PropTypes.object,
          damage: PropTypes.object,
          tank: PropTypes.object,
        }),
      }),
    }),
    stats: PropTypes.shape({
      pc: PropTypes.shape({
        competitive: PropTypes.shape({
          heroes_comparisons: PropTypes.shape({
            time_played: PropTypes.shape({
              values: PropTypes.array,
            }),
            games_won: PropTypes.shape({
              values: PropTypes.array,
            }),
            win_percentage: PropTypes.shape({
              values: PropTypes.array,
            }),
            weapon_accuracy_best_in_game: PropTypes.shape({
              values: PropTypes.array,
            }),
            eliminations_per_life: PropTypes.shape({
              values: PropTypes.array,
            }),
          }),
        }),
      }),
    }),
  }),
};

export default PlayerPage;

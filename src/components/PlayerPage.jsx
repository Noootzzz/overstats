import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import PlayerStats from './PlayerStats';

/* eslint react/prop-types: 0 */

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

const PlayerPage = () => {
  const { playerId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [heroStats, setHeroStats] = useState(null);
  const [heroesInfo, setHeroesInfo] = useState([]);
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);

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
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`https://overfast-api.tekrop.fr/players/${playerId}`);
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

  if (isLoading) {
    return <div className="container mx-auto px-4 mt-8 text-center">Loading... please wait.</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-start gap-6 p-6"
            style={{
              backgroundImage: playerData?.summary?.namecard ? `url(${playerData.summary.namecard})` : 'none',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-lg"></div>
              <img 
                src={playerData.summary.avatar} 
                alt={`${playerData.summary.username}'s avatar`} 
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-700/50 relative z-10" 
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-200">{playerData.summary.username}</h2>
                {playerData.summary.title && (
                  <p className="text-xl text-gray-400 mt-2">{playerData.summary.title}</p>
                )}
              </div>

              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full filter blur-sm"></div>
                  <img 
                    src={playerData.summary.endorsement.frame} 
                    alt="Endorsement level" 
                    className="w-12 h-12 relative z-10"
                  />
                </div>
                <span className="ml-3 text-lg font-medium text-gray-200">Level {playerData.summary.endorsement.level}</span>
              </div>

              <CompetitiveRanks playerData={playerData} />
            </div>
          </div>
        </div>

        {heroStats && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
        )}

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

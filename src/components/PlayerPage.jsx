import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import PlayerStats from './PlayerStats';

const RankDisplay = ({ role, roleData }) => {
  return (
    <div className="flex items-center mt-2 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
      <div className="flex items-center w-24">
        <img 
          src={roleData?.role_icon || `/roles/${role}.svg`} 
          alt={`${role} icon`} 
          className="w-8 h-8" 
        />
        <span className="ml-2 capitalize text-gray-300">{role}</span>
      </div>
      
      {roleData ? (
        <div className="flex items-center">
          <img 
            src={roleData.rank_icon} 
            alt="Rank icon" 
            className="w-8 h-8" 
          />
          <div className="ml-2">
            <span className="font-semibold text-white capitalize">
              {roleData.division}
            </span>
            <span className="text-gray-400 ml-1">
              {roleData.tier}
            </span>
          </div>
        </div>
      ) : (
        <span className="text-gray-400 ml-2">
          Unranked
        </span>
      )}
    </div>
  );
};

const CompetitiveRanks = ({ playerData }) => {
  const roles = ['support', 'damage', 'tank'];
  
  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-semibold mb-3">Competitive Ranks</h3>
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
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-center">
        {hero && (
          <img 
            src={hero.portrait} 
            alt={hero.name} 
            className="w-12 h-12 rounded-full mr-3"
          />
        )}
        <div>
          <p className="capitalize">{heroData?.hero}</p>
          <p className="text-gray-400">
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
    <div className="w-full flex justify-center items-center">
      <div className="mt-6 w-3/4">
        <div>
          <div className="flex items-center gap-4 mb-4 p-4 bg-black bg-opacity-50"
            style={{
              backgroundImage: playerData?.summary?.namecard ? `url(${playerData.summary.namecard})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '200px',
            }}>
            <img 
              src={playerData.summary.avatar} 
              alt={`${playerData.summary.username}'s avatar`} 
              className="w-32 h-32 rounded-full object-cover" 
            />
            
            <div>
              <h2 className="text-2xl font-bold">{playerData.summary.username}</h2>
              {playerData.summary.title && (
                <p className="text-lg text-gray-400">{playerData.summary.title}</p>
              )}

              <div className="flex items-center mt-2">
                <img 
                  src={playerData.summary.endorsement.frame} 
                  alt="Endorsement level" 
                  className="w-8 h-8"
                />
                <span className="ml-2">Level {playerData.summary.endorsement.level}</span>
              </div>

              <CompetitiveRanks playerData={playerData} />
            </div>
          </div>
        </div>

        {heroStats && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
  <PlayerStats playerId={playerId} />
)}</div>
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

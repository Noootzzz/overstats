import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

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

const PlayerPage = ({ playerData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [heroStats, setHeroStats] = useState(null);

  useEffect(() => {
    if (playerData) {
      setIsLoading(false);
      
      if (playerData.stats?.pc?.competitive?.heroes_comparisons) {
        const stats = {
          mostPlayed: playerData.stats.pc.competitive.heroes_comparisons.time_played?.values?.[0],
          highestWinRate: playerData.stats.pc.competitive.heroes_comparisons.win_percentage?.values
            ?.filter(hero => hero.value > 0)
            .sort((a, b) => b.value - a.value)[0],
          bestAccuracy: playerData.stats.pc.competitive.heroes_comparisons.weapon_accuracy_best_in_game?.values
            ?.sort((a, b) => b.value - a.value)[0]
        };
        setHeroStats(stats);
      }
    }
  }, [playerData]);

  if (isLoading) {
    return <div className="container mx-auto px-4 mt-8 text-center">Loading... please wait.</div>;
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="mt-6 w-3/4">
        <div 
          className="relative bg-cover bg-center rounded-lg overflow-hidden"
          style={{
            backgroundImage: playerData?.summary?.namecard ? `url(${playerData.summary.namecard})` : 'none',
            minHeight: '200px'
            
          }}
        >
          <div className="flex items-center gap-4 mb-4 p-4 bg-black bg-opacity-50">
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
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Most Played Hero</h3>
              <p className="capitalize">{heroStats.mostPlayed?.hero}</p>
              <p>{Math.floor(heroStats.mostPlayed?.value / 60)} minutes</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Highest Win Rate</h3>
              <p className="capitalize">{heroStats.highestWinRate?.hero}</p>
              <p>{heroStats.highestWinRate?.value}%</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Best Accuracy</h3>
              <p className="capitalize">{heroStats.bestAccuracy?.hero}</p>
              <p>{heroStats.bestAccuracy?.value}%</p>
            </div>
          </div>
        )}

        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">General Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playerData.stats?.pc?.competitive?.heroes_comparisons?.games_won?.values?.[0] && (
              <div>
                <p className="font-bold">Total Games Won</p>
                <p>{playerData.stats.pc.competitive.heroes_comparisons.games_won.values[0].value}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

RankDisplay.propTypes = {
  role: PropTypes.oneOf(['support', 'damage', 'tank']).isRequired,
  roleData: PropTypes.shape({
    role_icon: PropTypes.string,
    rank_icon: PropTypes.string,
    division: PropTypes.string,
    tier: PropTypes.number,
    sr: PropTypes.number
  })
};

CompetitiveRanks.propTypes = {
  playerData: PropTypes.shape({
    summary: PropTypes.shape({
      competitive: PropTypes.shape({
        pc: PropTypes.shape({
          support: PropTypes.object,
          damage: PropTypes.object,
          tank: PropTypes.object
        })
      })
    })
  }).isRequired
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
          support: PropTypes.shape({
            division: PropTypes.string,
            tier: PropTypes.number,
            role_icon: PropTypes.string,
            rank_icon: PropTypes.string,
          }),
          damage: PropTypes.shape({
            division: PropTypes.string,
            tier: PropTypes.number,
            role_icon: PropTypes.string,
            rank_icon: PropTypes.string,
          }),
          tank: PropTypes.shape({
            division: PropTypes.string,
            tier: PropTypes.number,
            role_icon: PropTypes.string,
            rank_icon: PropTypes.string,
          }),
        }),
      }),
    }),
    stats: PropTypes.shape({
      pc: PropTypes.shape({
        competitive: PropTypes.shape({
          heroes_comparisons: PropTypes.shape({
            time_played: PropTypes.shape({
              values: PropTypes.arrayOf(
                PropTypes.shape({
                  hero: PropTypes.string,
                  value: PropTypes.number,
                })
              ),
            }),
            games_won: PropTypes.shape({
              values: PropTypes.arrayOf(
                PropTypes.shape({
                  hero: PropTypes.string,
                  value: PropTypes.number,
                })
              ),
            }),
            win_percentage: PropTypes.shape({
              values: PropTypes.arrayOf(
                PropTypes.shape({
                  hero: PropTypes.string,
                  value: PropTypes.number,
                })
              ),
            }),
            weapon_accuracy_best_in_game: PropTypes.shape({
              values: PropTypes.arrayOf(
                PropTypes.shape({
                  hero: PropTypes.string,
                  value: PropTypes.number,
                })
              ),
            }),
          }),
        }),
      }),
    }),
  }),
};

export default PlayerPage;

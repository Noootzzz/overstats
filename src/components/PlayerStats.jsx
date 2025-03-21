import { useEffect, useState } from "react";
import { Skull, Heart, Swords, Gamepad, Medal, ChartNoAxesCombined, Timer, CircleDivide } from 'lucide-react';
import PropTypes from 'prop-types';

/* eslint react/prop-types: 0 */

const formatNumber = (num) => num ? num.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0';
const formatPlayTime = (seconds) => {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const StatCard = ({ icon, label, value, color = "blue" }) => (
    <div className={`bg-gray-800/80 p-4 rounded-xl backdrop-blur-sm border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/90`}>
        <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-200">{value}</p>
            </div>
        </div>
    </div>
);

const StatSection = ({ title, children }) => (
    <div className="bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <h3 className="text-xl font-bold mb-6 text-gray-200 border-b border-gray-700/50 pb-4">{title}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
        </div>
    </div>
);

const GeneralStats = ({ stats }) => (
    <StatSection title="General Statistics">
        <StatCard 
            icon={<Swords className="w-6 h-6 text-red-400" />} 
            label="Eliminations" 
            value={formatNumber(stats.total.eliminations)}
            color="red"
        />
        <StatCard 
            icon={<Skull className="w-6 h-6 text-gray-400" />} 
            label="Deaths" 
            value={formatNumber(stats.total.deaths)}
            color="gray"
        />
        <StatCard 
            icon={<Heart className="w-6 h-6 text-green-400" />} 
            label="Healing" 
            value={formatNumber(stats.total.healing)}
            color="green"
        />
        <StatCard 
            icon={<Swords className="w-6 h-6 text-orange-400" />} 
            label="Damage" 
            value={formatNumber(stats.total.damage)}
            color="orange"
        />
        <StatCard 
            icon={<CircleDivide className="w-6 h-6 text-blue-400" />} 
            label="KDA" 
            value={stats.kda ?? 'N/A'}
            color="blue"
        />
        <StatCard 
            icon={<ChartNoAxesCombined className="w-6 h-6 text-yellow-400" />} 
            label="Win Rate" 
            value={`${stats.winrate ?? 'N/A'}%`}
            color="yellow"
        />
        <StatCard 
            icon={<Gamepad className="w-6 h-6 text-purple-400" />} 
            label="Games Played" 
            value={formatNumber(stats.games_played)}
            color="purple"
        />
        <StatCard 
            icon={<Medal className="w-6 h-6 text-yellow-400" />} 
            label="Games Won" 
            value={formatNumber(stats.games_won)}
            color="yellow"
        />
        <StatCard 
            icon={<Timer className="w-6 h-6 text-indigo-400" />} 
            label="Time Played" 
            value={formatPlayTime(stats.time_played)}
            color="indigo"
        />
    </StatSection>
);

const AverageStats = ({ stats }) => (
    <StatSection title="Average Per Game">
        <StatCard 
            icon={<Swords className="w-6 h-6 text-red-400" />} 
            label="Eliminations" 
            value={stats.average.eliminations.toFixed(2)}
            color="red"
        />
        <StatCard 
            icon={<Swords className="w-6 h-6 text-white" />} 
            label="Assists" 
            value={stats.average.assists.toFixed(2)}
            color="gray"
        />
        <StatCard 
            icon={<Skull className="w-6 h-6 text-gray-400" />} 
            label="Deaths" 
            value={stats.average.deaths.toFixed(2)}
            color="gray"
        />
        <StatCard 
            icon={<Swords className="w-6 h-6 text-orange-400" />} 
            label="Damage" 
            value={formatNumber(stats.average.damage)}
            color="orange"
        />
        <StatCard 
            icon={<Heart className="w-6 h-6 text-green-400" />} 
            label="Healing" 
            value={formatNumber(stats.average.healing)}
            color="green"
        />
    </StatSection>
);

const RoleStats = ({ role, stats }) => (
    <StatSection title={`${role.charAt(0).toUpperCase() + role.slice(1)} Statistics`}>
        <StatCard 
            icon={<Gamepad className="w-6 h-6 text-purple-400" />} 
            label="Games Played" 
            value={formatNumber(stats.games_played)}
            color="purple"
        />
        <StatCard 
            icon={<Medal className="w-6 h-6 text-yellow-400" />} 
            label="Games Won" 
            value={formatNumber(stats.games_won)}
            color="yellow"
        />
        <StatCard 
            icon={<ChartNoAxesCombined className="w-6 h-6 text-yellow-400" />} 
            label="Win Rate" 
            value={`${stats.winrate}%`}
            color="yellow"
        />
        <StatCard 
            icon={<CircleDivide className="w-6 h-6 text-blue-400" />} 
            label="KDA" 
            value={stats.kda.toFixed(2)}
            color="blue"
        />
        <StatCard 
            icon={<Timer className="w-6 h-6 text-indigo-400" />} 
            label="Time Played" 
            value={formatPlayTime(stats.time_played)}
            color="indigo"
        />
        <StatCard 
            icon={<Swords className="w-6 h-6 text-red-400" />} 
            label="Avg. Elims" 
            value={stats.average.eliminations.toFixed(2)}
            color="red"
        />
        <StatCard 
            icon={<Swords className="w-6 h-6 text-white" />} 
            label="Avg. Assists" 
            value={stats.average.assists.toFixed(2)}
            color="gray"
        />
        <StatCard 
            icon={<Skull className="w-6 h-6 text-gray-400" />} 
            label="Avg. Deaths" 
            value={stats.average.deaths.toFixed(2)}
            color="gray"
        />
        <StatCard 
            icon={<Heart className="w-6 h-6 text-green-400" />} 
            label="Avg. Healing" 
            value={formatNumber(stats.average.healing)}
            color="green"
        />
    </StatSection>
);

const PlayerStats = ({ playerId }) => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            if (!playerId) {
                setError('Player ID is required');
                return;
            }

            const normalizedPlayerId = playerId.replace('#', '-');
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://overfast-api.tekrop.fr/players/${encodeURIComponent(normalizedPlayerId)}/stats/summary`,
                    { headers: { 'Accept': 'application/json' } }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch stats (Status: ${response.status})`);
                }

                const statsData = await response.json();
                setStats(statsData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [playerId]);

    if (isLoading) return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
    if (error) return (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center text-red-400">
            Error: {error}
        </div>
    );
    if (!stats) return null;

    return (
        <div className="space-y-6">
            <GeneralStats stats={stats.general} />
            <AverageStats stats={stats.general} />
            {Object.entries(stats.roles).map(([role, roleStats]) => (
                <RoleStats key={role} role={role} stats={roleStats} />
            ))}
        </div>
    );
};

PlayerStats.propTypes = {
    playerId: PropTypes.string.isRequired
};

export default PlayerStats;

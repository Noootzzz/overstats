import { useEffect, useState } from "react";
import { Skull, Heart, Swords, Gamepad, Medal, ChartNoAxesCombined, Timer, CircleDivide } from 'lucide-react';
import PropTypes from 'prop-types';

/* eslint react/prop-types: 0 */

const formatNumber = (num) => num ? num.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : '0';
const formatPlayTime = (seconds) => {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const StatRow = ({ icon, label, value }) => (
    <div>
        <p className="font-bold flex items-center gap-2">
            {icon}
            {label}
        </p>
        <p className="text-gray-300">{value}</p>
    </div>
);

const GeneralStats = ({ stats }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-4">General Stats</h3>
        <div className="grid grid-cols-2 gap-4">
        <StatRow icon={<Swords className="w-5 h-5 text-red-400" />} label="Eliminations" value={formatNumber(stats.total.eliminations)} />
                <StatRow icon={<Skull className="w-5 h-5 text-gray-400" />} label="Deaths" value={formatNumber(stats.total.deaths)} />
                <StatRow icon={<Heart className="w-5 h-5 text-green-400" />} label="Healing" value={formatNumber(stats.total.healing)} />
                <StatRow icon={<Swords className="w-5 h-5 text-orange-400" />} label="Damage" value={formatNumber(stats.total.damage)} />
                <StatRow icon={<CircleDivide className="w-5 h-5 text-blue-400" />} label="KDA" value={stats.kda ?? 'N/A'} />
                <StatRow icon={<ChartNoAxesCombined className="w-5 h-5 text-yellow-400" />} label="Winrate" value={`${stats.winrate ?? 'N/A'}%`} />
                <StatRow icon={<Gamepad className="w-5 h-5 text-purple-400" />} label="Games Played" value={formatNumber(stats.games_played)} />
                <StatRow icon={<Medal className="w-5 h-5 text-yellow-400" />} label="Games Won" value={formatNumber(stats.games_won)} />
                <StatRow icon={<Timer className="w-5 h-5 text-indigo-400" />} label="Time Played" value={formatPlayTime(stats.time_played)} />
        </div>
    </div>
);

const AverageStats = ({ stats }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Average Stats</h3>
        <div className="grid grid-cols-2 gap-4">
            <StatRow icon={<Swords className="w-5 h-5 text-red-400" />} label="Eliminations" value={stats.average.eliminations.toFixed(2)} />
            <StatRow icon={<Swords className="w-5 h-5 text-white" />} label="Assists" value={stats.average.assists.toFixed(2)} />
            <StatRow icon={<Skull className="w-5 h-5 text-gray-400" />} label="Deaths" value={stats.average.deaths.toFixed(2)} />
            <StatRow icon={<Swords className="w-5 h-5 text-orange-400" />} label="Damage" value={formatNumber(stats.average.damage)} />
            <StatRow icon={<Heart className="w-5 h-5 text-green-400" />} label="Healing" value={formatNumber(stats.average.healing)} />
        </div>
    </div>
);

const RoleStats = ({ role, stats }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
    <div className="border-b border-gray-700 pb-4 mb-4">
        <h3 className="text-xl font-bold mb-4 capitalize">{role} Stats</h3>
        <div className="grid grid-cols-2 gap-4">
            <StatRow icon={<Gamepad className="w-5 h-5 text-purple-400" />} label="Games Played" value={formatNumber(stats.games_played)} />
            <StatRow icon={<Medal className="w-5 h-5 text-yellow-400" />} label="Games Won" value={formatNumber(stats.games_won)} />
            <StatRow icon={<ChartNoAxesCombined className="w-5 h-5 text-yellow-400" />} label="Win Rate" value={`${stats.winrate}%`} />
            <StatRow icon={<CircleDivide className="w-5 h-5 text-blue-400" />} label="KDA" value={stats.kda.toFixed(2)} />
            <StatRow icon={<Timer className="w-5 h-5 text-indigo-400" />} label="Time Played" value={formatPlayTime(stats.time_played)} />
        </div>
        </div>
        <h4 className="text-xl font-bold mb-4 capitalize">Average</h4>
        <div className="grid grid-cols-2 gap-4">
            <StatRow icon={<Swords className="w-5 h-5 text-red-400" />} label="Eliminations" value={stats.average.eliminations.toFixed(2)} />
            <StatRow icon={<Swords className="w-5 h-5 text-white" />} label="Assists" value={stats.average.assists.toFixed(2)} />
            <StatRow icon={<Skull className="w-5 h-5 text-gray-400" />} label="Deaths" value={stats.average.deaths.toFixed(2)} />
            <StatRow icon={<Swords className="w-5 h-5 text-orange-400" />} label="Damage" value={formatNumber(stats.average.damage)} />
            <StatRow icon={<Heart className="w-5 h-5 text-green-400" />} label="Healing" value={formatNumber(stats.average.healing)} />
        </div>
    </div>
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

    if (isLoading) return <p className="text-gray-300">Loading stats...</p>;
    if (error) return <p className="text-red-400">Error: {error}</p>;
    if (!stats) return null;

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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

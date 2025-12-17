import React, { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp, Users, Globe } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Leaderboard = () => {
    const [view, setView] = useState('global'); // global | university
    const [period, setPeriod] = useState('weekly'); // weekly | monthly | alltime
    const [entries, setEntries] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
        fetchMyRank();
    }, [view, period]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const endpoint = view === 'global' ? '/leaderboard/global' : '/leaderboard/university';
            const response = await api.get(`${endpoint}?period=${period}`);
            
            if (response.data.success) {
                setEntries(response.data.leaderboard);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            if (error.response?.status === 400 && view === 'university') {
                toast.error('No university associated with your account');
            } else {
                toast.error('Failed to load leaderboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRank = async () => {
        try {
            const response = await api.get(`/leaderboard/my-rank?type=${view}&period=${period}`);
            if (response.data.success) {
                setMyRank(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch rank:', error);
        }
    };

    const getRankMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
                        <Trophy className="w-10 h-10 text-yellow-500" />
                        Leaderboard
                    </h1>
                    <p className="text-gray-400">Compete with others and climb the ranks</p>
                </div>

                {/* View Tabs */}
                <div className="flex gap-4 mb-6">
                    <TabButton
                        active={view === 'global'}
                        onClick={() => setView('global')}
                        icon={Globe}
                        label="Global"
                    />
                    <TabButton
                        active={view === 'university'}
                        onClick={() => setView('university')}
                        icon={Users}
                        label="My University"
                    />
                </div>

                {/* Period Selector */}
                <div className="flex gap-2 mb-8">
                    <PeriodButton
                        active={period === 'weekly'}
                        onClick={() => setPeriod('weekly')}
                        label="Weekly"
                    />
                    <PeriodButton
                        active={period === 'monthly'}
                        onClick={() => setPeriod('monthly')}
                        label="Monthly"
                    />
                    <PeriodButton
                        active={period === 'alltime'}
                        onClick={() => setPeriod('alltime')}
                        label="All Time"
                    />
                </div>

                {/* My Rank Card */}
                {myRank?.rank && (
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm mb-1">Your Rank</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl font-bold text-white">
                                        {getRankMedal(myRank.rank)}
                                    </span>
                                    <div>
                                        <p className="text-2xl font-bold text-white">#{myRank.rank}</p>
                                        <p className="text-white/80 text-sm">{myRank.score.toLocaleString()} points</p>
                                    </div>
                                </div>
                            </div>
                            <TrendingUp className="w-12 h-12 text-white/50" />
                        </div>
                    </div>
                )}

                {/* Leaderboard Table */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {entries.length === 0 ? (
                        <div className="text-center py-20">
                            <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No entries yet</p>
                            <p className="text-gray-500 text-sm mt-2">Be the first to make the leaderboard!</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Rank</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">User</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Score</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Achievements</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Streak</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => (
                                    <tr key={entry._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="text-2xl font-bold text-white">
                                                {getRankMedal(entry.rank)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-white font-medium">{entry.userName}</p>
                                                <p className="text-gray-500 text-sm">{entry.userEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-yellow-500 font-bold text-lg">
                                                {entry.score.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-purple-400 font-medium">
                                                {entry.stats.achievementsCount}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1">
                                                <span className="text-orange-500">🔥</span>
                                                <span className="text-white font-medium">{entry.stats.streak}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Info */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400">
                        💡 <strong>How scoring works:</strong> Your score is calculated from coins earned, XP gained, achievements unlocked, and streak maintained.
                    </p>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            active
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

const PeriodButton = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            active
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);

export default Leaderboard;

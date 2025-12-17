import React, { useState, useEffect } from 'react';
import { Trophy, Award, TrendingUp, Star } from 'lucide-react';
import AchievementCard from '../components/AchievementCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [filter, setFilter] = useState('all'); // all | unlocked | locked
    const [category, setCategory] = useState('all'); // all | milestone | streak | usage | social
    const [stats, setStats] = useState({ total: 0, unlocked: 0, locked: 0, percentComplete: 0, totalXP: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await api.get('/achievements/my-progress');
            if (response.data.success) {
                setAchievements(response.data.progress);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch achievements:', error);
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    const filteredAchievements = achievements.filter(ach => {
        // Filter by unlock status
        if (filter === 'unlocked' && !ach.unlocked) return false;
        if (filter === 'locked' && ach.unlocked) return false;

        // Filter by category
        if (category !== 'all' && ach.category !== category) return false;

        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading achievements...</p>
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
                        Achievements
                    </h1>
                    <p className="text-gray-400">Track your progress and unlock rewards</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Award}
                        label="Unlocked"
                        value={`${stats.unlocked}/${stats.total}`}
                        color="text-green-400"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Progress"
                        value={`${stats.percentComplete}%`}
                        color="text-blue-400"
                    />
                    <StatCard
                        icon={Star}
                        label="Total XP"
                        value={stats.totalXP.toLocaleString()}
                        color="text-purple-400"
                    />
                    <StatCard
                        icon={Trophy}
                        label="Locked"
                        value={stats.locked}
                        color="text-gray-400"
                    />
                </div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                    <div className="flex flex-wrap gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Status</label>
                            <div className="flex gap-2">
                                <FilterButton
                                    active={filter === 'all'}
                                    onClick={() => setFilter('all')}
                                    label="All"
                                />
                                <FilterButton
                                    active={filter === 'unlocked'}
                                    onClick={() => setFilter('unlocked')}
                                    label="Unlocked"
                                />
                                <FilterButton
                                    active={filter === 'locked'}
                                    onClick={() => setFilter('locked')}
                                    label="Locked"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Category</label>
                            <div className="flex gap-2">
                                <FilterButton
                                    active={category === 'all'}
                                    onClick={() => setCategory('all')}
                                    label="All"
                                />
                                <FilterButton
                                    active={category === 'milestone'}
                                    onClick={() => setCategory('milestone')}
                                    label="Milestone"
                                />
                                <FilterButton
                                    active={category === 'streak'}
                                    onClick={() => setCategory('streak')}
                                    label="Streak"
                                />
                                <FilterButton
                                    active={category === 'usage'}
                                    onClick={() => setCategory('usage')}
                                    label="Usage"
                                />
                                <FilterButton
                                    active={category === 'social'}
                                    onClick={() => setCategory('social')}
                                    label="Social"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Grid */}
                {filteredAchievements.length === 0 ? (
                    <div className="text-center py-20">
                        <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No achievements found</p>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAchievements.map(achievement => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                progress={achievement.progress}
                                unlocked={achievement.unlocked}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm mb-1">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            <Icon className={`w-10 h-10 ${color}`} />
        </div>
    </div>
);

const FilterButton = ({ active, onClick, label }) => (
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

export default Achievements;

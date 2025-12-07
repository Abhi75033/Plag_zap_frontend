import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Zap, Target } from 'lucide-react';
import { getTeamAnalytics } from '../services/api';

const TeamLeaderboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data } = await getTeamAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to load leaderboard', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{index + 1}</span>;
    };

    const getScoreColor = (score) => {
        if (score < 20) return 'text-green-400';
        if (score < 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
            </div>
        );
    }

    if (!analytics?.topContributors?.length) {
        return (
            <div className="text-center py-12 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-500/20 text-center">
                    <Trophy className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                    <p className="text-2xl font-bold">{analytics.totalAnalyses}</p>
                    <p className="text-xs text-gray-400">Total Checks</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/20 text-center">
                    <Target className="w-8 h-8 mx-auto text-green-400 mb-2" />
                    <p className="text-2xl font-bold">{analytics.averageScore?.toFixed(0)}%</p>
                    <p className="text-xs text-gray-400">Team Avg</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/20 text-center">
                    <Zap className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                    <p className="text-2xl font-bold">{analytics.memberCount}</p>
                    <p className="text-xs text-gray-400">Members</p>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Leaderboard
                </h3>
                {analytics.topContributors.map((member, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30' :
                            index === 1 ? 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/30' :
                            index === 2 ? 'bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-500/30' :
                            'bg-white/5 border-white/10'
                        }`}
                    >
                        {getRankIcon(index)}
                        <div className="flex-1">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.count} analyses</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-bold ${getScoreColor(member.avgScore)}`}>
                                {member.avgScore?.toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-500">avg score</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TeamLeaderboard;

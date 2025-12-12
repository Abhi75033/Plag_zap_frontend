import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, TrendingUp, Award, Calendar } from 'lucide-react';
import { getTeamAnalytics } from '../services/api';

const TeamAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const { data } = await getTeamAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center text-gray-400 py-8">
                No analytics available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-xl border border-purple-500/20"
                >
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">Total Analyses</span>
                    </div>
                    <p className="text-3xl font-bold">{analytics.totalAnalyses}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/20"
                >
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm font-medium">Avg Score</span>
                    </div>
                    <p className="text-3xl font-bold">{analytics.averageScore?.toFixed(1) || 0}%</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-500/20"
                >
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-medium">Members</span>
                    </div>
                    <p className="text-3xl font-bold">{analytics.memberCount}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-500/20"
                >
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Award className="w-5 h-5" />
                        <span className="text-sm font-medium">Shared Items</span>
                    </div>
                    <p className="text-3xl font-bold">{analytics.sharedItems}</p>
                </motion.div>
            </div>

            {/* Top Contributors */}
            {analytics.topContributors?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Top Contributors
                    </h3>
                    <div className="space-y-3">
                        {analytics.topContributors.map((contributor, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                        index === 0 ? 'bg-yellow-500 text-black' :
                                        index === 1 ? 'bg-gray-400 text-black' :
                                        index === 2 ? 'bg-amber-600 text-white' :
                                        'bg-white/10 text-gray-400'
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <span className="font-medium">{contributor.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-400">{contributor.count} analyses</span>
                                    <span className="text-green-400">{contributor.avgScore?.toFixed(1)}% avg</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Recent Activity */}
            {analytics.recentActivity?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Last 7 Days Activity
                    </h3>
                    <div className="flex items-end gap-2 h-24">
                        {analytics.recentActivity.map((day, index) => {
                            const maxCount = Math.max(...analytics.recentActivity.map(d => d.count));
                            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                    <div 
                                        className="w-full bg-purple-500/50 rounded-t"
                                        style={{ height: `${Math.max(height, 10)}%` }}
                                    />
                                    <span className="text-[10px] text-gray-500">{day._id?.slice(-2)}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TeamAnalytics;

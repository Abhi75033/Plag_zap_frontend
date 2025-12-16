import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, TrendingUp } from 'lucide-react';

/**
 * StreakCard Component
 * Displays current streak with visual appeal
 */
const StreakCard = ({ currentStreak, longestStreak, lastActiveDate }) => {
    const getStreakColor = (streak) => {
        if (streak >= 60) return 'from-red-500 to-orange-500';
        if (streak >= 30) return 'from-orange-500 to-yellow-500';
        if (streak >= 7) return 'from-yellow-500 to-green-500';
        return 'from-blue-500 to-purple-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/80 p-6 border border-white/10 shadow-2xl"
        >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getStreakColor(currentStreak)} shadow-lg`}>
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Current Streak</h3>
                        <p className="text-sm text-gray-400">
                            {lastActiveDate
                                ? `Last active: ${new Date(lastActiveDate).toLocaleDateString()}`
                                : 'Start your streak today!'}
                        </p>
                    </div>
                </div>

                {/* Current Streak Display */}
                <div className="flex items-baseline gap-2 mb-6">
                    <motion.div
                        key={currentStreak}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400"
                    >
                        {currentStreak}
                    </motion.div>
                    <span className="text-2xl text-gray-400 font-semibold">days</span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <div>
                            <p className="text-xs text-gray-400">Personal Best</p>
                            <p className="text-lg font-bold text-white">{longestStreak} days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <div>
                            <p className="text-xs text-gray-400">Next Milestone</p>
                            <p className="text-lg font-bold text-white">
                                {currentStreak < 7 ? '7 days' : currentStreak < 30 ? '30 days' : currentStreak < 45 ? '45 days' : currentStreak < 60 ? '60 days' : 'Max!'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StreakCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Lock } from 'lucide-react';

/**
 * MilestoneProgress Component
 * Shows available milestones and claim buttons
 */
const MILESTONES = [
    { days: 1, coins: 2, label: '1 Day' },
    { days: 7, coins: 30, label: '1 Week' },
    { days: 30, coins: 60, label: '1 Month' },
    { days: 45, coins: 90, label: '45 Days' },
    { days: 60, coins: 120, label: '2 Months' }
];

const MilestoneProgress = ({ currentStreak, claimedMilestones = [], availableMilestones = [], onClaim }) => {
    const [claiming, setClaiming] = React.useState(null);

    const handleClaim = async (days) => {
        setClaiming(days);
        try {
            await onClaim(days);
        } finally {
            setClaiming(null);
        }
    };

    const getMilestoneStatus = (milestone) => {
        const claimed = claimedMilestones.some(m => m.days === milestone.days);
        const available = availableMilestones.some(m => m.days === milestone.days);
        
        if (claimed) return 'claimed';
        if (available) return 'available';
        return 'locked';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/80 p-6 border border-white/10 shadow-2xl"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
                    <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Streak Milestones</h3>
                    <p className="text-sm text-gray-400">Claim rewards for consistency</p>
                </div>
            </div>

            <div className="space-y-3">
                {MILESTONES.map((milestone, index) => {
                    const status = getMilestoneStatus(milestone);
                    const isClaiming = claiming === milestone.days;

                    return (
                        <motion.div
                            key={milestone.days}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                status === 'claimed'
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : status === 'available'
                                    ? 'bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-500/10'
                                    : 'bg-gray-800/30 border-gray-700/30'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {status === 'claimed' ? (
                                    <div className="p-2 rounded-lg bg-green-500/20">
                                        <Check className="w-5 h-5 text-green-400" />
                                    </div>
                                ) : status === 'locked' ? (
                                    <div className="p-2 rounded-lg bg-gray-700/30">
                                        <Lock className="w-5 h-5 text-gray-500" />
                                    </div>
                                ) : (
                                    <div className="p-2 rounded-lg bg-purple-500/20">
                                        <Gift className="w-5 h-5 text-purple-400" />
                                    </div>
                                )}
                                
                                <div>
                                    <p className={`font-semibold ${status === 'locked' ? 'text-gray-500' : 'text-white'}`}>
                                        {milestone.label}
                                    </p>
                                    <p className={`text-sm ${status === 'locked' ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {milestone.coins} coins reward
                                    </p>
                                </div>
                            </div>

                            {status === 'available' && (
                                 <button
                                    onClick={() => handleClaim(milestone.days)}
                                    disabled={isClaiming}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/30 disabled:opacity-50"
                                >
                                    {isClaiming ? 'Claiming...' : 'Claim'}
                                </button>
                            )}
                            {status === 'claimed' && (
                                <span className="text-sm text-green-400 font-medium">Claimed ✓</span>
                            )}
                            {status === 'locked' && (
                                <span className="text-sm text-gray-500">{milestone.days - currentStreak} days left</span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default MilestoneProgress;

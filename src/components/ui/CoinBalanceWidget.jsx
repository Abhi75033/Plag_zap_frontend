import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * CoinBalance Widget
 * Shows coin balance with recent changes
 */
const CoinBalanceWidget = ({ balance, recentTransactions = [] }) => {
    // Calculate recent change
    const recentEarned = recentTransactions
        .filter(t => t.type === 'earn')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const recentSpent = recentTransactions
        .filter(t => t.type === 'spend')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 border border-purple-500/20 shadow-2xl"
        >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                        <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Coin Balance</h3>
                        <p className="text-sm text-gray-400">Your rewards wallet</p>
                    </div>
                </div>

                {/* Balance Display */}
                <div className="flex items-baseline gap-2 mb-4">
                    <motion.div
                        key={balance}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400"
                    >
                        {balance}
                    </motion.div>
                    <span className="text-xl text-gray-400 font-semibold">coins</span>
                </div>

                {/* Recent Activity */}
                {(recentEarned > 0 || recentSpent > 0) && (
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        {recentEarned > 0 && (
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-green-400 font-medium">+{recentEarned}</span>
                            </div>
                        )}
                        {recentSpent > 0 && (
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-red-400 font-medium">-{recentSpent}</span>
                            </div>
                        )}
                        <span className="text-xs text-gray-500">Last 5 transactions</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CoinBalanceWidget;

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Sparkles, Clock, FileText } from 'lucide-react';

/**
 * RedemptionShop Component
 * Shows available items to purchase with coins
 */
const SHOP_ITEMS = [
    {
        id: 'EXTRA_ANALYSES_5',
        name: '5 Extra Analyses',
        description: 'Run 5 additional plagiarism checks',
        cost: 50,
        icon: Zap,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'EXTRA_HUMANIZE_10',
        name: '10 Extra Humanize Attempts',
        description: 'Humanize text 10 more times',
        cost: 100,
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'TEMP_PREMIUM_24H',
        name: '24 Hour Premium',
        description: 'Unlock all premium features for 24 hours',
        cost: 200,
        icon: Clock,
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 'TEMP_PREMIUM_72H',
        name: '72 Hour Premium',
        description: 'Unlock all premium features for 72 hours',
        cost: 500,
        icon: FileText,
        color: 'from-yellow-500 to-orange-500'
    }
];

const RedemptionShop = ({ userCoins, onRedeem }) => {
    const [redeeming, setRedeeming] = React.useState(null);

    const handleRedeem = async (itemId) => {
        setRedeeming(itemId);
        try {
            await onRedeem(itemId);
        } finally {
            setRedeeming(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/80 p-6 border border-white/10 shadow-2xl"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                    <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Rewards Shop</h3>
                    <p className="text-sm text-gray-400">Redeem coins for benefits</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SHOP_ITEMS.map((item, index) => {
                    const canAfford = userCoins >= item.cost;
                    const isRedeeming = redeeming === item.id;
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative overflow-hidden rounded-xl border p-5 transition-all ${
                                canAfford
                                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-white/20 hover:border-white/40 hover:shadow-xl'
                                    : 'bg-gray-900/30 border-gray-700/30 opacity-60'
                            }`}
                        >
                            {/* Background gradient glow */}
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl`} />

                            <div className="relative z-10">
                                {/* Icon & Title */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white mb-1">{item.name}</h4>
                                        <p className="text-xs text-gray-400">{item.description}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                                            {item.cost}
                                        </span>
                                        <span className="text-sm text-gray-400">coins</span>
                                    </div>

                                    <button
                                        onClick={() => handleRedeem(item.id)}
                                        disabled={!canAfford || isRedeeming}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                            canAfford
                                                ? `bg-gradient-to-r ${item.color} hover:shadow-lg text-white`
                                                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {isRedeeming ? 'Redeeming...' : canAfford ? 'Redeem' : 'Locked'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-sm text-blue-200/80 text-center">
                    💡 <strong>Pro Tip:</strong> Keep building your streak to earn more coins! Consistency pays off.
                </p>
            </div>
        </motion.div>
    );
};

export default RedemptionShop;

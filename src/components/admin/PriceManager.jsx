import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Save, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PriceManager = () => {
    const [prices, setPrices] = useState({
        monthly: 199,
        quarterly: 499,
        biannual: 599,
        annual: 999,
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const plans = [
        { id: 'monthly', name: 'Monthly', description: '30 days' },
        { id: 'quarterly', name: 'Quarterly', description: '3 months' },
        { id: 'biannual', name: 'Biannual', description: '6 months' },
        { id: 'annual', name: 'Annual', description: '12 months' },
    ];

    const handlePriceChange = (planId, value) => {
        setPrices(prev => ({
            ...prev,
            [planId]: parseInt(value) || 0
        }));
    };

    const handleSave = () => {
        // For now, prices would be saved in environment variables
        // In a production app, you'd save these to a database
        toast.success('Prices updated! Update your server .env file to persist changes.');
        console.log('New prices:', prices);
    };

    return (
        <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Price Management
                </h3>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                    <p className="font-medium text-blue-400 mb-1">How Dynamic Pricing Works</p>
                    <p>Set your plan prices here. These will be used when creating Razorpay orders. 
                    To persist changes, update PRICE_MONTHLY, PRICE_QUARTERLY, PRICE_BIANNUAL, and PRICE_ANNUAL in your server's .env file.</p>
                </div>
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-white">{plan.name}</h4>
                                <p className="text-xs text-gray-400">{plan.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-400">₹</span>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={prices[plan.id]}
                                onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                                className="flex-1 px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-green-500 outline-none text-xl font-bold text-white"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Save Prices
                        </>
                    )}
                </button>
            </div>

            {/* Env Variables Helper */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">Add these to your <code className="text-purple-400">server/.env</code>:</p>
                <pre className="text-xs text-green-400 font-mono bg-black/50 p-3 rounded-lg overflow-x-auto">
{`PRICE_MONTHLY=${prices.monthly}
PRICE_QUARTERLY=${prices.quarterly}
PRICE_BIANNUAL=${prices.biannual}
PRICE_ANNUAL=${prices.annual}`}
                </pre>
            </div>
        </div>
    );
};

export default PriceManager;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, History, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import rewardsAPI from '../services/rewards';
import referralAPI from '../services/referrals'; // Phase 2: Referrals
import StreakCard from '../components/ui/StreakCard';
import CoinBalanceWidget from '../components/ui/CoinBalanceWidget';
import MilestoneProgress from '../components/ui/MilestoneProgress';
import RedemptionShop from '../components/ui/RedemptionShop';
import ReferralCard from '../components/ui/ReferralCard'; // Phase 2
import EmailVerificationBanner from '../components/EmailVerificationBanner'; // Phase 3
import { getCurrentUser } from '../services/api'; // Phase 3

/**
 * Rewards Page
 * Phase 1 - Core rewards system UI
 */
const Rewards = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        coins: 0,
        streak: {
            current: 0,
            longest: 0,
            lastActive: null,
            claimedMilestones: [],
            availableMilestones: []
        },
        recentTransactions: []
    });
    const [referralData, setReferralData] = useState(null); // Phase 2
    const [user, setUser] = useState(null); // Phase 3: For email verification
    const [error, setError] = useState(null);

    const fetchRewardsData = async () => {
        try {
            const response = await rewardsAPI.getBalance();
            if (response.success) {
                setData({
                    coins: response.coins,
                    streak: response.streak,
                    recentTransactions: response.recentTransactions || []
                });
            }
        } catch (err) {
            console.error('Failed to fetch rewards data:', err);
            setError('Failed to load rewards data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Phase 2: Fetch referral data
    const fetchReferralData = async () => {
        try {
            const [codeRes, statsRes] = await Promise.all([
                referralAPI.getMyCode(),
                referralAPI.getStats(),
            ]);
            
            if (codeRes.success && statsRes.success) {
                setReferralData({
                    code: codeRes.referralCode,
                    shareLink: codeRes.shareLink,
                    stats: {  
                        totalReferrals: statsRes.totalReferrals,
                        pendingReferrals: statsRes.pendingReferrals,
                        rewardedReferrals: statsRes.rewardedReferrals,
                        referrals: statsRes.referrals,
                    },
                });
            }
        } catch (err) {
            console.error('Failed to fetch referral data:', err);
            // Non-critical - don't show error
        }
    };

    // Phase 3: Fetch user data (for email verification status)
    const fetchUserData = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData); // getCurrentUser now returns data directly
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            // Non-critical
        }
    };

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            await Promise.all([
                fetchRewardsData(),
                fetchReferralData(),
                fetchUserData()
            ]);
            setLoading(false);
        };
        loadAllData();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            fetchRewardsData(),
            fetchReferralData(),
            fetchUserData() // Also refresh user data on manual refresh
        ]);
        setRefreshing(false);
    };

    const handleClaimMilestone = async (days) => {
        try {
            const response = await rewardsAPI.claimMilestone(days);
            if (response.success) {
                // Refresh data to show updated coins and claimed milestones
                await fetchRewardsData();
            }
        } catch (err) {
            console.error('Failed to claim milestone:', err);
            alert('Failed to claim milestone. Please try again.');
        }
    };

    const handleRedeem = async (itemType) => {
        try {
            const response = await rewardsAPI.redeem(itemType);
            if (response.success) {
                // Show success message
                alert(`Successfully redeemed: ${response.item}`);
                // Refresh data
                await fetchRewardsData();
            }
        } catch (err) {
            console.error('Failed to redeem:', err);
            alert(err.response?.data?.error || 'Failed to redeem item. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading rewards...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchRewardsData}
                        className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
                                    <Gift className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-extrabold text-white">Rewards</h1>
                                    <p className="text-sm text-gray-400">Earn coins, build streaks, unlock benefits</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Phase 3: Email Verification Banner */}
                <EmailVerificationBanner />
                
                {/* Top Row: Streak & Coins */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <StreakCard
                        currentStreak={data.streak.current}
                        longestStreak={data.streak.longest}
                        lastActiveDate={data.streak.lastActive}
                    />
                    <CoinBalanceWidget
                        balance={data.coins}
                        recentTransactions={data.recentTransactions}
                    />
                </div>

                {/* Middle Row: Milestones */}
                <div className="mb-6">
                    <MilestoneProgress
                        currentStreak={data.streak.current}
                        claimedMilestones={data.streak.claimedMilestones}
                        availableMilestones={data.streak.availableMilestones}
                        onClaim={handleClaimMilestone}
                    />
                </div>

                {/* Phase 2: Referrals */}
                {referralData && (
                    <div className="mb-6">
                        <ReferralCard
                            referralCode={referralData.code}
                            stats={referralData.stats}
                            shareLink={referralData.shareLink}
                        />
                    </div>
                )}

                {/* Bottom Row: Shop */}
                <div>
                    <RedemptionShop
                        userCoins={data.coins}
                        onRedeem={handleRedeem}
                    />
                </div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20"
                >
                    <h3 className="text-lg font-bold text-white mb-2">How to Earn More Coins?</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>✅ <strong>Daily Streak</strong>: Use PlagZap daily to build your streak</li>
                        <li>🔥 <strong>Milestones</strong>: Reach 7, 30, 45, and 60-day streaks for big rewards</li>
                        <li>🎯 <strong>Meaningful Actions</strong>: Run analyses, humanize text, generate content</li>
                        <li>💡 <strong>Note:</strong> Just logging in doesn't count - you need to use the platform!</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default Rewards;

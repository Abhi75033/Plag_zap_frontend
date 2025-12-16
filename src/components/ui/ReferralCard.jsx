import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, Share2, Gift, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ReferralCard Component
 * Shows user's referral code, stats, and pending referrals
 */
const ReferralCard = ({ referralCode, stats = {}, shareLink }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        toast.success('Referral link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join PlagZap!',
                text: `Use my referral code ${referralCode} and get 25 bonus coins! I'll get 50 coins too 🎉`,
                url: shareLink,
            }).catch(() => {});
        } else {
            handleCopy();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-6 border border-emerald-500/20 shadow-2xl"
        >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Refer Friends</h3>
                        <p className="text-sm text-gray-400">Earn 50 coins per referral</p>
                    </div>
                </div>

                {/* Referral Code Display */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <label className="text-xs text-gray-400 mb-2 block">Your Referral Code</label>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 text-3xl font-bold font-mono text-emerald-400 tracking-widest">
                            {referralCode}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="p-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                            title="Copy code"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <Copy className="w-5 h-5 text-emerald-400" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                    >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-semibold">Copy Link</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-lg"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">Share</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">{stats.totalReferrals || 0}</div>
                        <div className="text-xs text-gray-400">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{stats.pendingReferrals || 0}</div>
                        <div className="text-xs text-gray-400">Pending</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.rewardedReferrals || 0}</div>
                        <div className="text-xs text-gray-400">Rewarded</div>
                    </div>
                </div>

                {/* Referral List */}
                {stats.referrals && stats.referrals.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-gray-300 mb-3">Recent Referrals</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {stats.referrals.slice(0, 5).map((ref) => (
                                <div
                                    key={ref.id}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        {ref.status === 'rewarded' && <Gift className="w-4 h-4 text-green-400" />}
                                        {ref.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                                        {ref.status === 'validated' && <CheckCircle className="w-4 h-4 text-blue-400" />}
                                        <div>
                                            <p className="text-sm font-medium text-white">{ref.userName || 'User'}</p>
                                            <p className="text-xs text-gray-500">
                                                {ref.status === 'pending' && `${ref.actionsNeeded} actions needed`}
                                                {ref.status === 'validated' && 'Validated'}
                                                {ref.status === 'rewarded' && 'Rewarded'}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            ref.status === 'rewarded'
                                                ? 'bg-green-500/20 text-green-400'
                                                : ref.status === 'validated'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                        }`}
                                    >
                                        {ref.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Banner */}
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-xs text-emerald-200/80">
                        <strong>How it works:</strong> Share your code. When someone signs up and completes 2 actions within 24 hours, you both get coins!
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ReferralCard;

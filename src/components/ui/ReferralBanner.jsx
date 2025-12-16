import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Compact Referral Banner for Dashboard
 * Shows referral code with quick copy/share actions
 */
const ReferralBanner = ({ referralCode, shareLink }) => {
  if (!referralCode) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Referral link copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl bg-gradient-to-r from-emerald-600/15 via-teal-600/15 to-cyan-600/15 border border-emerald-500/20 p-4 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-0.5">Your Referral Code</h4>
            <div className="flex items-center gap-2">
              <code className="text-xl font-bold font-mono text-emerald-400 tracking-widest">
                {referralCode}
              </code>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                title="Copy referral link"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
        <Link
          to="/rewards"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg transition-all shadow-md text-xs font-semibold whitespace-nowrap"
        >
          <Users className="w-3.5 h-3.5" />
          View Stats
        </Link>
      </div>
      <p className="text-xs text-emerald-200/60 mt-2.5 ml-11">
        Earn <strong>50 coins</strong> per friend • They get <strong>25 welcome bonus</strong>
      </p>
    </motion.div>
  );
};

export default ReferralBanner;

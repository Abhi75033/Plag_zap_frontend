import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, Zap, Star, Crown, Medal, Award, Gift } from 'lucide-react';

const StreakBadges = ({ streak = 0, longestStreak = 0, totalAnalyses = 0, badges = [], newBadges = [] }) => {
  
  // Get streak fire intensity
  const getStreakColor = () => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 7) return 'from-orange-500 to-red-500';
    if (streak >= 3) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  // Badge icon mapping
  const getBadgeIcon = (icon) => {
    const iconMap = {
      '🎯': Target,
      '📊': Award,
      '💪': Zap,
      '💯': Medal,
      '🔥': Flame,
      '⚡': Zap,
      '👑': Crown,
      '🌟': Star,
      '💎': Gift,
    };
    const IconComponent = iconMap[icon] || Trophy;
    return IconComponent;
  };

  return (
    <div className="space-y-4">
      {/* Streak Display */}
      <div className={`p-4 rounded-xl bg-gradient-to-r ${getStreakColor()} bg-opacity-20 border border-white/10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Current Streak</p>
              <p className="text-2xl font-bold text-white flex items-center gap-1">
                {streak} 
                <span className="text-sm text-gray-400">day{streak !== 1 ? 's' : ''}</span>
                {streak >= 3 && <span className="text-lg">🔥</span>}
                {streak >= 7 && <span className="text-lg">⚡</span>}
                {streak >= 30 && <span className="text-lg">👑</span>}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Best: {longestStreak} days</p>
            <p className="text-xs text-gray-400">Total: {totalAnalyses} analyses</p>
          </div>
        </div>

        {/* Streak progress to next milestone */}
        {streak < 30 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Next milestone</span>
              <span>
                {streak < 3 ? '3 days' : streak < 7 ? '7 days' : '30 days'}
              </span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-1.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min(100, (streak / (streak < 3 ? 3 : streak < 7 ? 7 : 30)) * 100)}%` 
                }}
                className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* New Badges Toast */}
      {newBadges && newBadges.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl"
        >
          <p className="text-sm font-bold text-green-400 mb-2">🎉 New Badge Earned!</p>
          <div className="flex gap-2">
            {newBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-medium text-white">{badge.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Badges Grid */}
      {badges && badges.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Your Badges ({badges.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {badges.map((badge, idx) => {
              const IconComponent = getBadgeIcon(badge.icon);
              return (
                <motion.div
                  key={badge.id || idx}
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center cursor-default group transition-all"
                  title={badge.description}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <p className="text-xs font-medium text-gray-300 truncate">{badge.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* No badges yet */}
      {(!badges || badges.length === 0) && (
        <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-xl text-center">
          <Trophy className="w-10 h-10 mx-auto mb-2 text-gray-600" />
          <p className="text-sm text-gray-400">No badges yet</p>
          <p className="text-xs text-gray-500 mt-1">Complete analyses to earn badges!</p>
        </div>
      )}
    </div>
  );
};

export default StreakBadges;

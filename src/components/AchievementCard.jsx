import React from 'react';

/**
 * Achievement Card Component
 * Displays individual achievement with progress, locked/unlocked state
 */
const AchievementCard = ({ achievement, progress = 0, unlocked = false }) => {
    const rarityColors = {
        common: 'from-gray-600 to-gray-700',
        rare: 'from-blue-600 to-indigo-700',
        epic: 'from-purple-600 to-pink-700',
        legendary: 'from-yellow-500 to-orange-600'
    };

    const rarityBorderColors = {
        common: 'border-gray-500',
        rare: 'border-blue-500',
        epic: 'border-purple-500',
        legendary: 'border-yellow-500'
    };

    return (
        <div 
            className={`relative bg-gray-900/50 border-2 ${rarityBorderColors[achievement.rarity]} rounded-xl p-6 transition-all ${
                unlocked ? 'opacity-100 hover:scale-105' : 'opacity-60'
            } ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >
            {/* Rarity Badge */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
                {achievement.rarity.toUpperCase()}
            </div>

            {/* Icon */}
            <div className="flex items-start gap-4 mb-4">
                <div className={`text-5xl ${unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                        {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {achievement.description}
                    </p>
                </div>
            </div>

            {/* Rewards */}
            <div className="flex gap-3 mb-3 text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                    <span className="font-bold">🪙 {achievement.coinReward}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                    <span className="font-bold">✨ {achievement.xpReward} XP</span>
                </div>
            </div>

            {/* Progress Bar */}
            {!unlocked && (
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Unlocked Badge */}
            {unlocked && (
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                    <span className="text-xl">✓</span>
                    <span>UNLOCKED</span>
                </div>
            )}
        </div>
    );
};

export default AchievementCard;

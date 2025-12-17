import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Achievement Toast Notification
 * Shows when user unlocks a new achievement
 */
const AchievementToast = ({ achievement, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setVisible(true), 100);

        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
}, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const rarityColors = {
        common: 'from-gray-600 to-gray-700',
        rare: 'from-blue-600 to-indigo-700',
        epic: 'from-purple-600 to-pink-700',
        legendary: 'from-yellow-500 to-orange-600'
    };

    return (
        <div 
            className={`fixed top-20 right-6 z-50 transform transition-all duration-300 ${
                visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl p-6 shadow-2xl max-w-sm">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl animate-bounce">🎉</div>
                    <div>
                        <h2 className="text-2xl font-bold text-yellow-400">Achievement Unlocked!</h2>
                        <p className="text-xs text-gray-400">Congratulations!</p>
                    </div>
                </div>

                {/* Achievement Info */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{achievement.icon}</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                            {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {achievement.description}
                        </p>
                    </div>
                </div>

                {/* Rewards */}
                <div className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} rounded-lg p-4 flex items-center justify-between`}>
                    <div>
                        <div className="text-xs text-white/70 mb-1">Rewards</div>
                        <div className="flex gap-4 text-white font-bold">
                            <span>🪙 +{achievement.coinReward}</span>
                            <span>✨ +{achievement.xpReward} XP</span>
                        </div>
                    </div>
                    <div className="text-xs text-white/90 uppercase font-bold">
                        {achievement.rarity}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Hook to show achievement notifications
 */
export const useAchievementNotification = () => {
    const [currentAchievement, setCurrentAchievement] = useState(null);

    const showAchievement = (achievement) => {
        setCurrentAchievement(achievement);
        toast.success(`Achievement unlocked: ${achievement.name}!`, {
            icon: '🎉',
            duration: 5000
        });
    };

    const AchievementNotification = currentAchievement ? (
        <AchievementToast 
            achievement={currentAchievement} 
            onClose={() => setCurrentAchievement(null)}
        />
    ) : null;

    return {
        showAchievement,
        AchievementNotification
    };
};

export default AchievementToast;

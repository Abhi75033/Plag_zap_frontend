import React from 'react';
import { Users, User, MicOff, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ParticipantPanel Component
 * Shows list of participants with their status
 */
const ParticipantPanel = ({ participants, localUser, isOpen, onClose }) => {
    if (!isOpen) return null;

    const allParticipants = [
        {
            socketId: 'local',
            userId: localUser?.id,
            userName: `${localUser?.name || 'You'} (You)`,
            audioEnabled: true,
            videoEnabled: true,
            handRaised: false
        },
        ...participants
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.2 }}
                className="fixed left-0 top-16 bottom-0 w-80 bg-[#202124] border-r border-white/10 flex flex-col z-40"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            Participants ({allParticipants.length})
                        </h3>
                    </div>
                </div>

                {/* Participant List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {allParticipants.map((participant) => (
                        <div
                            key={participant.socketId}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-sm">
                                    {participant.userName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {participant.userName || 'Guest'}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {!participant.audioEnabled && (
                                        <MicOff className="w-3 h-3 text-[#ea4335]" />
                                    )}
                                    {participant.handRaised && (
                                        <Hand className="w-3 h-3 text-yellow-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ParticipantPanel;

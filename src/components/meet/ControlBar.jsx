import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff, MessageSquare, Hand, Users, Maximize, Minimize, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ControlBar Component - Google Meet Exact Style
 * Bottom control bar with circular buttons
 */
const ControlBar = ({
    audioEnabled,
    videoEnabled,
    isScreenSharing,
    handRaised,
    isFullscreen,
    onToggleAudio,
    onToggleVideo,
    onToggleScreenShare,
    onToggleHand,
    onToggleChat,
    onToggleParticipants,
    onToggleFullscreen,
    onToggleSettings,
    onLeave,
    className = ''
}) => {
    const [showControls, setShowControls] = useState(true);

    return (
        <AnimatePresence>
            {showControls && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
                >
                    <div className="bg-[#202124] border-t border-white/10 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
                            {/* Left: Participants & Chat (All devices) */}
                            <div className="flex items-center gap-2 sm:gap-3" role="group" aria-label="Meeting tools">
                                <button
                                    onClick={onToggleParticipants}
                                    className="p-2 sm:p-3 hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="Toggle participants panel"
                                    title="Show/hide participants"
                                >
                                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={onToggleChat}
                                    className="p-2 sm:p-3 hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="Toggle chat panel"
                                    title="Show/hide chat"
                                >
                                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Center: Main Controls */}
                            <div className="flex items-center justify-center gap-3 sm:gap-4" role="group" aria-label="Meeting controls">
                                {/* Mic Toggle */}
                                <button
                                    onClick={onToggleAudio}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                                        audioEnabled
                                            ? 'bg-[#3c4043] hover:bg-[#5f6368]'
                                            : 'bg-[#ea4335] hover:bg-[#d33b2c]'
                                    }`}
                                    aria-label={audioEnabled ? 'Mute microphone (Ctrl+D)' : 'Unmute microphone (Ctrl+D)'}
                                    aria-pressed={!audioEnabled}
                                    title={audioEnabled ? 'Mute' : 'Unmute'}
                                >
                                    {audioEnabled ? (
                                        <Mic className="w-6 h-6 text-white" aria-hidden="true" />
                                    ) : (
                                        <MicOff className="w-6 h-6 text-white" aria-hidden="true" />
                                    )}
                                </button>

                                {/* Camera Toggle */}
                                <button
                                    onClick={onToggleVideo}
                                    disabled={isScreenSharing}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                                        isScreenSharing
                                            ? 'bg-[#5f6368] cursor-not-allowed opacity-50'
                                            : videoEnabled
                                            ? 'bg-[#3c4043] hover:bg-[#5f6368]'
                                            : 'bg-[#ea4335] hover:bg-[#d33b2c]'
                                    }`}
                                    aria-label={
                                        isScreenSharing 
                                            ? 'Camera disabled during screen share'
                                            : videoEnabled ? 'Turn off camera (Ctrl+E)' : 'Turn on camera (Ctrl+E)'
                                    }
                                    aria-pressed={!videoEnabled}
                                    title={
                                        isScreenSharing
                                            ? 'Stop screen sharing first'
                                            : videoEnabled ? 'Turn off camera' : 'Turn on camera'
                                    }
                                >
                                    {videoEnabled ? (
                                        <Video className="w-6 h-6 text-white" aria-hidden="true" />
                                    ) : (
                                        <VideoOff className="w-6 h-6 text-white" aria-hidden="true" />
                                    )}
                                </button>

                                {/* Screen Share Toggle */}
                                <button
                                    onClick={onToggleScreenShare}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                                        isScreenSharing
                                            ? 'bg-[#1a73e8] hover:bg-[#1557b0]'
                                            : 'bg-[#3c4043] hover:bg-[#5f6368]'
                                    }`}
                                    aria-label={isScreenSharing ? 'Stop sharing screen' : 'Share screen (Ctrl+Shift+E)'}
                                    aria-pressed={isScreenSharing}
                                    title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                                >
                                    {isScreenSharing ? (
                                        <MonitorOff className="w-6 h-6 text-white" aria-hidden="true" />
                                    ) : (
                                        <Monitor className="w-6 h-6 text-white" aria-hidden="true" />
                                    )}
                                </button>

                                {/* Fullscreen Toggle */}
                                <button
                                    onClick={onToggleFullscreen}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#3c4043] hover:bg-[#5f6368] flex items-center justify-center transition-all hover:scale-105"
                                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                                >
                                    {isFullscreen ? (
                                        <Minimize className="w-6 h-6 text-white" aria-hidden="true" />
                                    ) : (
                                        <Maximize className="w-6 h-6 text-white" aria-hidden="true" />
                                    )}
                                </button>

                                {/* Settings (Three Dots) */}
                                <button
                                    onClick={onToggleSettings}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#3c4043] hover:bg-[#5f6368] flex items-center justify-center transition-all hover:scale-105"
                                    aria-label="Settings"
                                    title="Settings"
                                >
                                    <MoreVertical className="w-6 h-6 text-white" aria-hidden="true" />
                                </button>

                                {/* Raise Hand */}
                                <button
                                    onClick={onToggleHand}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                                        handRaised
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : 'bg-[#3c4043] hover:bg-[#5f6368]'
                                    }`}
                                    aria-label={handRaised ? 'Lower hand (Ctrl+Shift+H)' : 'Raise hand (Ctrl+Shift+H)'}
                                    aria-pressed={handRaised}
                                    title={handRaised ? 'Lower hand' : 'Raise hand'}
                                >
                                    <Hand className="w-6 h-6 text-white" aria-hidden="true" />
                                </button>

                                {/* Leave Call Button (Prominent Red) */}
                                <button
                                    onClick={onLeave}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ea4335] hover:bg-[#d33b2c] flex items-center justify-center transition-all hover:scale-105 shadow-lg ml-2 sm:ml-4"
                                    aria-label="Leave meeting (Ctrl+W)"
                                    title="Leave call"
                                >
                                    <PhoneOff className="w-6 h-6 text-white" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Right: Empty for balance (Desktop only) */}
                            <div className="hidden md:block w-[100px]" aria-hidden="true"></div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(ControlBar);

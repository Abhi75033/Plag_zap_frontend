import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ControlBar Component - Google Meet Exact Style
 * Bottom control bar with circular buttons
 */
const ControlBar = ({
    audioEnabled,
    videoEnabled,
    isScreenSharing,
    onToggleAudio,
    onToggleVideo,
    onToggleScreenShare,
    onLeave,
    className = ''
}) => {
    const [showControls, setShowControls] = useState(true);

    // Auto-hide controls after 3 seconds (future feature)
    // useEffect(() => {
    //     let timeout;
    //     if (showControls) {
    //         timeout = setTimeout(() => setShowControls(false), 3000);
    //     }
    //     return () => clearTimeout(timeout);
    // }, [showControls]);

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
                        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-center gap-3 sm:gap-4">
                            {/* Mic Toggle */}
                            <button
                                onClick={onToggleAudio}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                                    audioEnabled
                                        ? 'bg-[#3c4043] hover:bg-[#5f6368]'
                                        : 'bg-[#ea4335] hover:bg-[#d33b2c]'
                                }`}
                                title={audioEnabled ? 'Mute' : 'Unmute'}
                            >
                                {audioEnabled ? (
                                    <Mic className="w-6 h-6 text-white" />
                                ) : (
                                    <MicOff className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {/* Camera Toggle */}
                            <button
                                onClick={onToggleVideo}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                                    videoEnabled
                                        ? 'bg-[#3c4043] hover:bg-[#5f6368]'
                                        : 'bg-[#ea4335] hover:bg-[#d33b2c]'
                                }`}
                                title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
                            >
                                {videoEnabled ? (
                                    <Video className="w-6 h-6 text-white" />
                                ) : (
                                    <VideoOff className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {/* Screen Share Toggle (Desktop only) */}
                            <button
                                onClick={onToggleScreenShare}
                                className={`hidden sm:flex w-12 h-12 sm:w-14 sm:h-14 rounded-full items-center justify-center transition-all hover:scale-105 ${
                                    isScreenSharing
                                        ? 'bg-[#1a73e8] hover:bg-[#1557b0]'
                                        : 'bg-[#3c4043] hover:bg-[#5f6368]'
                                }`}
                                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                            >
                                {isScreenSharing ? (
                                    <MonitorOff className="w-6 h-6 text-white" />
                                ) : (
                                    <Monitor className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {/* Leave Call Button (Prominent Red) */}
                            <button
                                onClick={onLeave}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ea4335] hover:bg-[#d33b2c] flex items-center justify-center transition-all hover:scale-105 shadow-lg ml-2 sm:ml-4"
                                title="Leave call"
                            >
                                <PhoneOff className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ControlBar;

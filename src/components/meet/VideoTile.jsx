import React, { useEffect, useRef } from 'react';
import { MicOff, VideoOff } from 'lucide-react';

/**
 * VideoTile Component - Google Meet Style
 * Individual participant video tile with name overlay and status indicators
 */
const VideoTile = ({ 
    stream, 
    name, 
    isMuted, 
    isVideoOff,
    isLocal = false,
    isScreenShare = false,
    className = ''
}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Generate initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div 
            className={`relative bg-[#3c4043] rounded-xl overflow-hidden aspect-video ${className}`}
            style={{ minHeight: '200px' }}
        >
            {/* Video Element */}
            {!isVideoOff ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal} // Mute local to avoid feedback
                    className={`w-full h-full object-cover ${isLocal && !isScreenShare ? 'scale-x-[-1]' : ''}`}
                />
            ) : (
                /* Avatar when video is off */
                <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1557b0] flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold">
                        {getInitials(name)}
                    </div>
                </div>
            )}

            {/* Name Overlay (Bottom Left) */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg flex items-center gap-2">
                <span className="text-white text-sm font-medium truncate max-w-[150px]">
                    {name || 'Guest'}
                </span>
                {isMuted && (
                    <MicOff className="w-4 h-4 text-[#ea4335]" />
                )}
            </div>

            {/* Video Off Indicator (Top Left) */}
            {isVideoOff && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#ea4335]/80 rounded-md flex items-center gap-1.5">
                    <VideoOff className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-medium">Camera off</span>
                </div>
            )}

            {/* Screen Share Indicator */}
            {isScreenShare && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-[#1a73e8]/80 rounded-md">
                    <span className="text-white text-xs font-medium">Presenting</span>
                </div>
            )}
        </div>
    );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(VideoTile);

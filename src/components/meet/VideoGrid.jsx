import React from 'react';
import VideoTile from './VideoTile';

/**
 * VideoGrid Component - Google Meet Style
 * Responsive grid layout that adapts based on participant count
 */
const VideoGrid = ({ localStream, peers, localUser, audioEnabled, videoEnabled }) => {
    const totalParticipants = peers.size + 1; // +1 for local user

    // Determine grid class based on participant count
    const getGridClass = () => {
        if (totalParticipants === 1) return 'grid grid-cols-1';
        if (totalParticipants === 2) return 'grid grid-cols-1 sm:grid-cols-2';
        if (totalParticipants <= 4) return 'grid grid-cols-2';
        if (totalParticipants <= 9) return 'grid grid-cols-2 sm:grid-cols-3';
        return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    };

    // Check if we should show as single large video
    const isSingleParticipant = totalParticipants === 1;

    return (
        <div className="flex-1 flex items-center justify-center p-4 max-w-7xl mx-auto w-full">
            <div className={`${getGridClass()} gap-2 sm:gap-3 w-full transition-all duration-300`}>
                {/* Local User Tile */}
                <VideoTile
                    stream={localStream}
                    name={`${localUser?.name || 'You'} (You)`}
                    isMuted={!audioEnabled}
                    isVideoOff={!videoEnabled}
                    isLocal={true}
                    className={isSingleParticipant ? 'max-w-4xl mx-auto' : ''}
                />

                {/* Remote Participants */}
                {Array.from(peers.entries()).map(([socketId, peerData]) => (
                    <VideoTile
                        key={socketId}
                        stream={peerData.stream}
                        name={peerData.userName || 'Participant'}
                        isMuted={!peerData.audioEnabled}
                        isVideoOff={!peerData.videoEnabled}
                        isLocal={false}
                    />
                ))}
            </div>
        </div>
    );
};

export default VideoGrid;

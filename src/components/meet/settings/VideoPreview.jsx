import React, { useState, useEffect, useRef } from 'react';

/**
 * Video Preview Component
 * Live camera preview with mirror effect
 */
const VideoPreview = ({ stream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative w-full aspect-video bg-[#202124] rounded-lg overflow-hidden">
            {stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]" // Mirrored
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#1a73e8] to-[#1557b0] rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-semibold">
                            ?
                        </div>
                        <p className="text-[#9aa0a6] text-sm">No camera selected</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPreview;

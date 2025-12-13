import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton Loader Components
 * Google Meet style loading placeholders
 */

// Shimmer animation
const shimmer = {
    hidden: { backgroundPosition: '-1000px 0' },
    visible: {
        backgroundPosition: '1000px 0',
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'linear'
        }
    }
};

// Video Tile Skeleton
export const VideoTileSkeleton = () => (
    <motion.div
        variants={shimmer}
        initial="hidden"
        animate="visible"
        className="relative bg-[#3c4043] rounded-xl overflow-hidden aspect-video"
        style={{
            background: 'linear-gradient(90deg, #3c4043 0%, #5f6368 50%, #3c4043 100%)',
            backgroundSize: '1000px 100%'
        }}
    >
        {/* Name placeholder */}
        <div className="absolute bottom-3 left-3">
            <div className="h-6 w-24 bg-black/40 rounded-lg" />
        </div>
    </motion.div>
);

// Control Bar Skeleton
export const ControlBarSkeleton = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-[#202124] border-t border-white/10 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-center gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            delay: i * 0.1
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#3c4043]"
                    />
                ))}
            </div>
        </div>
    </div>
);

// Meeting Lobby Skeleton
export const MeetingLobbySkeleton = () => (
    <div className="space-y-4 p-6">
        {/* Title skeleton */}
        <div className="h-8 w-48 bg-[#3c4043] rounded-lg animate-pulse" />
        
        {/* Buttons skeleton */}
        <div className="space-y-3">
            <div className="h-12 w-full bg-[#3c4043] rounded-lg animate-pulse" />
            <div className="h-12 w-full bg-[#3c4043] rounded-lg animate-pulse" />
        </div>

        {/* Recent meetings skeleton */}
        <div className="mt-6">
            <div className="h-6 w-32 bg-[#3c4043] rounded mb-3 animate-pulse" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-full bg-[#3c4043] rounded-lg mb-2 animate-pulse" />
            ))}
        </div>
    </div>
);

// Chat Message Skeleton
export const ChatMessageSkeleton = () => (
    <div className="flex justify-start mb-3">
        <div className="max-w-[75%] flex flex-col gap-1">
            <div className="h-3 w-16 bg-[#3c4043] rounded animate-pulse" />
            <div className="px-4 py-2 bg-[#3c4043] rounded-2xl rounded-bl-sm">
                <div className="h-4 w-32 bg-[#5f6368] rounded animate-pulse" />
            </div>
        </div>
    </div>
);

// Participant Item Skeleton
export const ParticipantSkeleton = () => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#5f6368] animate-pulse shrink-0" />
        {/* Name */}
        <div className="flex-1">
            <div className="h-4 w-24 bg-[#5f6368] rounded animate-pulse" />
        </div>
    </div>
);

// Full Page Loading
export const FullPageLoader = ({ message = 'Loading...' }) => (
    <div className="min-h-screen bg-[#202124] flex items-center justify-center">
        <div className="text-center">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5
                }}
                className="w-16 h-16 mx-auto mb-4"
            >
                <div className="w-full h-full rounded-full border-4 border-[#1a73e8] border-t-transparent animate-spin" />
            </motion.div>
            <p className="text-white text-lg">{message}</p>
        </div>
    </div>
);

// Inline Spinner
export const InlineSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3'
    };

    return (
        <div className={`${sizes[size]} rounded-full border-[#1a73e8] border-t-transparent animate-spin ${className}`} />
    );
};

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Video, VideoOff, Mic, MicOff, PhoneOff, Settings, 
    Monitor, Users, MessageSquare, Copy
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useMediaDevices } from '../hooks/useMediaDevices';
import { useWebRTC } from '../hooks/useWebRTC';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { meetingAPI } from '../services/meetingAPI';
import VideoGrid from '../components/meet/VideoGrid';
import ControlBar from '../components/meet/ControlBar';
import ChatPanel from '../components/meet/ChatPanel';
import ParticipantPanel from '../components/meet/ParticipantPanel';
import SettingsModal from '../components/meet/settings/SettingsModal';
import { ActiveSpeakerDetector } from '../utils/activeSpeaker';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

/**
 * VideoMeeting Page - Google Meet Clone
 * Main meeting interface with video grid and controls
 */
const VideoMeeting = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const { user } = useAppContext();
    
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(true);
    const [handRaised, setHandRaised] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [activeSpeaker, setActiveSpeaker] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const activeSpeakerDetectorRef = useRef(null);

    // Media devices hook
    const {
        localStream,
        audioEnabled,
        videoEnabled,
        isScreenSharing,
        error: mediaError,
        toggleAudio,
        toggleVideo,
        startScreenShare,
        stopScreenShare
    } = useMediaDevices();

    // WebRTC hook
    const token = localStorage.getItem('token');
    const {
        peers,
        participants,
        connected,
        socket,
        leaveMeeting
    } = useWebRTC(code, localStream, token);

    // Load meeting details
    useEffect(() => {
        const loadMeeting = async () => {
            try {
                const response = await meetingAPI.getMeeting(code);
                setMeeting(response.data.meeting);
                setLoading(false);
            } catch (error) {
                console.error('Error loading meeting:', error);
                toast.error(error.response?.data?.error || 'Meeting not found');
                navigate('/');
            }
        };

        if (code) {
            loadMeeting();
        }
    }, [code, navigate]);

    // Join meeting
    useEffect(() => {
        const joinRoom = async () => {
            try {
                await meetingAPI.joinMeeting(code);
                setJoining(false);
            } catch (error) {
                console.error('Error joining meeting:', error);
                toast.error(error.response?.data?.error || 'Failed to join meeting');
                navigate('/');
            }
        };

        if (code && !loading) {
            joinRoom();
        }
    }, [code, loading, navigate]);

    // Handle media errors
    useEffect(() => {
        if (mediaError) {
            toast.error(`Media error: ${mediaError}`);
        }
    }, [mediaError]);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        // Chat message
        socket.on('chat-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Participant state changes
        socket.on('participant-audio-changed', ({ socketId, enabled }) => {
            setParticipants(prev =>
                prev.map(p => p.socketId === socketId ? { ...p, audioEnabled: enabled } : p)
            );
        });

        socket.on('participant-video-changed', ({ socketId, enabled }) => {
            setParticipants(prev =>
                prev.map(p => p.socketId === socketId ? { ...p, videoEnabled: enabled } : p)
            );
        });

        socket.on('participant-hand-raised', ({ socketId, raised }) => {
            setParticipants(prev =>
                prev.map(p => p.socketId === socketId ? { ...p, handRaised: raised } : p)
            );
        });

        // Host left - meeting ended
        socket.on('host-left', ({ message }) => {
            console.log('Host left, meeting ended');
            toast.error(message || 'The host ended the meeting');
            
            // Stop all media tracks
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            
            // Navigate away after short delay
            setTimeout(() => {
                navigate('/team');
            }, 2000);
        });

        // Meeting already ended when trying to join
        socket.on('meeting-ended', ({ message }) => {
            console.log('Meeting has ended');
            toast.error(message || 'This meeting has ended');
            setTimeout(() => {
                navigate('/team');
            }, 1500);
        });

        return () => {
            socket.off('chat-message');
            socket.off('participant-audio-changed');
            socket.off('participant-video-changed');
            socket.off('participant-hand-raised');
            socket.off('host-left');
            socket.off('meeting-ended');
        };
    }, [socket, localStream, navigate]);

    // Active speaker detection
    useEffect(() => {
        if (!localStream) return;

        const detector = new ActiveSpeakerDetector();
        activeSpeakerDetectorRef.current = detector;

        // Add local stream
        detector.addStream('local', localStream);

        // Add peer streams
        peers.forEach((peerData, socketId) => {
            if (peerData.stream) {
                detector.addStream(socketId, peerData.stream);
            }
        });

        // Start detection
        detector.start((speakerId) => {
            setActiveSpeaker(speakerId);
        });

        return () => {
            detector.stop();
        };
    }, [localStream, peers]);

    // Handle audio toggle
    const handleToggleAudio = () => {
        const newState = toggleAudio();
        if (socket) {
            socket.emit('toggle-audio', { enabled: newState });
        }
    };

    // Handle video toggle
    const handleToggleVideo = async () => {
        const newState = await toggleVideo();
        if (socket) {
            socket.emit('toggle-video', { enabled: newState });
        }
    };

    // Handle screen share
    const handleToggleScreenShare = async () => {
        if (isScreenSharing) {
            await stopScreenShare();
            if (socket) {
                socket.emit('screen-share-stopped');
            }
        } else {
            const stream = await startScreenShare();
            if (stream && socket) {
                socket.emit('screen-share-started');
            }
        }
    };

    // Handle raise hand
    const handleToggleHand = () => {
        const newState = !handRaised;
        setHandRaised(newState);
        if (socket) {
            socket.emit('raise-hand', { raised: newState });
        }
        toast(newState ? '✋ Hand raised' : 'Hand lowered', {
            icon: newState ? '✋' : '👋',
            duration: 2000
        });
    };

    // Handle leave
    const handleLeave = () => {
        console.log('Leaving meeting - cleanup started');
        
        // Stop active speaker detection
        if (activeSpeakerDetectorRef.current) {
            activeSpeakerDetectorRef.current.stop();
        }

        // Stop all media tracks
        if (localStream) {
            localStream.getTracks().forEach(track => {
                track.stop();
                console.log(`Stopped ${track.kind} track`);
            });
        }

        // Leave room via WebRTC hook
        leaveMeeting();
        
        // Show toast and navigate after short delay
        toast.success('Left meeting');
        
        setTimeout(() => {
            navigate('/team');
        }, 500);
    };

    // Handle fullscreen toggle
    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error('Error entering fullscreen:', err);
                toast.error('Could not enter fullscreen');
            });
        } else {
            // Exit fullscreen
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            }).catch((err) => {
                console.error('Error exiting fullscreen:', err);
            });
        }
    };

    // Listen for fullscreen changes (e.g., ESC key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard shortcuts (must be after handler functions)
    useKeyboardShortcuts({
        onToggleAudio: handleToggleAudio,
        onToggleVideo: handleToggleVideo,
        onToggleScreenShare: handleToggleScreenShare,
        onToggleChat: () => setShowChat(!showChat),
        onToggleParticipants: () => setShowParticipants(!showParticipants),
        onToggleHand: handleToggleHand,
        onLeave: handleLeave,
        isEnabled: !loading && !joining
    });

    // Loading state
    if (loading || joining) {
        return (
            <div className="min-h-screen bg-[#202124] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#1a73e8] animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">
                        {loading ? 'Loading meeting...' : 'Joining meeting...'}
                    </p>
                    {meeting && (
                        <p className="text-gray-400 text-sm mt-2">
                            {meeting.title}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#202124] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header 
                className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#202124] border-b border-white/10 relative z-30"
                role="banner"
                aria-label="Meeting header"
            >
                <div className="flex items-center gap-3">
                    <h1 className="text-white font-medium text-lg truncate max-w-[300px]" id="meeting-title">
                        {meeting?.title || 'Meeting'}
                    </h1>
                    <span className="text-[#9aa0a6] text-sm font-mono" aria-label="Meeting code">
                        {code}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[#9aa0a6] text-sm" role="status" aria-live="polite" aria-label="Meeting status">
                    <span 
                        className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
                        role="status"
                        aria-label={connected ? 'Connected' : 'Disconnected'}
                    />
                    <span className="hidden sm:inline">
                        {peers.size + 1} participant{peers.size !== 0 ? 's' : ''}
                    </span>
                </div>
            </header>

            {/* Video Grid */}
            <VideoGrid
                localStream={localStream}
                peers={peers}
                localUser={user}
                audioEnabled={audioEnabled}
                videoEnabled={videoEnabled}
            />

            {/* Video Controls Bar - Mobile Optimized */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-3 sm:p-6 z-30">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                        {/* Mic Button */}
                        <button
                            onClick={handleToggleAudio}
                            className={`p-3 sm:p-4 rounded-full transition-all ${
                                audioEnabled
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                            title={audioEnabled ? 'Mute' : 'Unmute'}
                        >
                            {audioEnabled ? (
                                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>

                        {/* Camera Button */}
                        <button
                            onClick={handleToggleVideo}
                            className={`p-3 sm:p-4 rounded-full transition-all ${
                                videoEnabled
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                            title={videoEnabled ? 'Stop video' : 'Start video'}
                        >
                            {videoEnabled ? (
                                <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>

                        {/* Screen Share Button - Desktop only (mobile browsers don't support it) */}
                        <button
                            onClick={handleToggleScreenShare}
                            className={`hidden sm:block p-3 sm:p-4 rounded-full transition-all ${
                                isScreenSharing
                                    ? 'bg-purple-600 hover:bg-purple-700'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                        >
                            <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Share Meeting Code Button */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(code);
                                toast.success('Meeting code copied!');
                            }}
                            className="p-3 sm:p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
                            title="Copy meeting code"
                        >
                            <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Settings Button */}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-3 sm:p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Leave/Hangup Button - ALWAYS VISIBLE */}
                        <button
                            onClick={handleLeave}
                            className="p-3 sm:p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
                            title="Leave meeting"
                        >
                            <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/* Meeting Code - Mobile Optimized */}
                    <div className="mt-3 sm:mt-4 text-center">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(code);
                                toast.success('Meeting code copied!');
                            }}
                            className="inline-flex items-center gap-2 bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <span className="text-gray-400 text-xs sm:text-sm">Meeting Code:</span>
                            <span className="font-mono font-bold text-xs sm:text-sm">{code}</span>
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                localStream={localStream}
            />

            {/* Chat Panel */}
            <ChatPanel
                socket={socket}
                currentUser={user}
                isOpen={showChat}
                onClose={() => setShowChat(false)}
            />

            {/* Participant Panel */}
            <ParticipantPanel
                participants={participants}
                localUser={user}
                isOpen={showParticipants}
                onClose={() => setShowParticipants(false)}
            />
        </div>
    );
};

export default VideoMeeting;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useMediaDevices } from '../hooks/useMediaDevices';
import { useWebRTC } from '../hooks/useWebRTC';
import { meetingAPI } from '../services/meetingAPI';
import VideoGrid from '../components/meet/VideoGrid';
import ControlBar from '../components/meet/ControlBar';
import ChatPanel from '../components/meet/ChatPanel';
import ParticipantPanel from '../components/meet/ParticipantPanel';
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
        if (activeSpeakerDetectorRef.current) {
            activeSpeakerDetectorRef.current.stop();
        }
        leaveMeeting();
        toast.success('Left meeting');
        navigate('/team');
    };

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
            <div className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#202124] border-b border-white/10 relative z-30">
                <div className="flex items-center gap-3">
                    <h1 className="text-white font-medium text-lg truncate max-w-[300px]">
                        {meeting?.title || 'Meeting'}
                    </h1>
                    <span className="text-[#9aa0a6] text-sm font-mono">
                        {code}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[#9aa0a6] text-sm">
                    <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="hidden sm:inline">
                        {peers.size + 1} participant{peers.size !== 0 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Video Grid */}
            <VideoGrid
                localStream={localStream}
                peers={peers}
                localUser={user}
                audioEnabled={audioEnabled}
                videoEnabled={videoEnabled}
            />

            {/* Control Bar */}
            <ControlBar
                audioEnabled={audioEnabled}
                videoEnabled={videoEnabled}
                isScreenSharing={isScreenSharing}
                handRaised={handRaised}
                onToggleAudio={handleToggleAudio}
                onToggleVideo={handleToggleVideo}
                onToggleScreenShare={handleToggleScreenShare}
                onToggleHand={handleToggleHand}
                onToggleChat={() => setShowChat(!showChat)}
                onToggleParticipants={() => setShowParticipants(!showParticipants)}
                onLeave={handleLeave}
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

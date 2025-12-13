import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import {
    Video, Mic, MicOff, VideoOff, PhoneOff, Copy, Users, Plus, Share2,
    Monitor, Settings as SettingsIcon, Layout, MoreVertical, X, Check,
    MessageSquare, Hand, MonitorOff, Speaker, Grid3x3, Sidebar as SidebarIcon,
    Maximize, ThumbsUp, Heart, Laugh, PartyPopper, Send, ChevronDown, Minimize
} from 'lucide-react';
import toast from 'react-hot-toast';

const VideoConnect = ({ teamId, user }) => {
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState(null);
    const [joined, setJoined] = useState(false);
    const [meetingCode, setMeetingCode] = useState(teamId || '');
    const [inputCode, setInputCode] = useState('');

    // Media States
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenStream, setScreenStream] = useState(null);

    // UI States
    const [layout, setLayout] = useState('grid'); // grid, sidebar, spotlight
    const [showSettings, setShowSettings] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [handRaised, setHandRaised] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pinnedPeer, setPinnedPeer] = useState(null);

    // Device States
    const [audioDevices, setAudioDevices] = useState([]);
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioOutputDevices, setAudioOutputDevices] = useState([]);
    const [selectedAudio, setSelectedAudio] = useState('');
    const [selectedVideo, setSelectedVideo] = useState('');
    const [selectedAudioOutput, setSelectedAudioOutput] = useState('');

    // Chat States
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomId = teamId || inputCode;
    const originalStreamRef = useRef(null); // Store original camera stream
    const fullscreenContainerRef = useRef(null); // Reference to fullscreen container

    const [videoError, setVideoError] = useState(false);
    
    const setVideoRef = React.useCallback((node) => {
        userVideo.current = node;
        if (node && stream) {
            node.srcObject = stream;
            node.muted = true;
            
            // Only mirror if not screen sharing
            if (!isScreenSharing) {
                node.style.transform = "scaleX(-1)";
            } else {
                node.style.transform = "none";
            }
            
            const startPlay = async () => {
                try {
                    await node.play();
                    setVideoError(false);
                } catch (e) {
                    console.error("Autoplay blocked:", e);
                    setVideoError(true);
                }
            };
            startPlay();
        }
    }, [stream, isScreenSharing]);

    // Enumerate devices on mount
    useEffect(() => {
        enumerateDevices();
    }, []);

    const enumerateDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter(d => d.kind === 'audioinput');
            const videoInputs = devices.filter(d => d.kind === 'videoinput');
            const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
            
            setAudioDevices(audioInputs);
            setVideoDevices(videoInputs);
            setAudioOutputDevices(audioOutputs);
            
            if (audioInputs.length > 0) setSelectedAudio(audioInputs[0].deviceId);
            if (videoInputs.length > 0) setSelectedVideo(videoInputs[0].deviceId);
            if (audioOutputs.length > 0) setSelectedAudioOutput(audioOutputs[0].deviceId);
        } catch (err) {
            console.error("Error enumerating devices:", err);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const createMeeting = () => {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setMeetingCode(newCode);
        joinRoom(newCode);
    };

    const copyInvite = () => {
        const inviteText = `Join my meeting on PlagZap! Code: ${meetingCode}`;
        navigator.clipboard.writeText(inviteText);
        toast.success("Invite copied to clipboard!");
    };

    const joinRoom = (code) => {
        const roomToJoin = code || inputCode;
        if (!roomToJoin) {
            toast.error("Please enter a meeting code");
            return;
        }

        const proceedJoin = (currentStream) => {
            if (!stream) setStream(currentStream);
            originalStreamRef.current = currentStream; // Store original stream
            
            socketRef.current = io.connect('https://plagzap-backend-8yxx.onrender.com');
            
            socketRef.current.emit('join-room', roomToJoin, user.id);
            setMeetingCode(roomToJoin);
            console.log(`🟢 Joining room: ${roomToJoin} as user: ${user.id}`);

            socketRef.current.on('all-users', users => {
                console.log(`👥 Users in room:`, users);
                const peersList = [];
                users.forEach(userID => {
                    console.log(`🔗 Creating peer connection for user: ${userID}`);
                    const peer = createPeer(userID, socketRef.current.id, currentStream);
                    peersRef.current.push({ peerID: userID, peer });
                    peersList.push({ peerID: userID, peer });
                });
                setPeers(peersList);
            });

            socketRef.current.on('user-joined', payload => {
                console.log(`✅ New user joined:`, payload.callerID);
                const peer = addPeer(payload.signal, payload.callerID, currentStream);
                peersRef.current.push({ peerID: payload.callerID, peer });
                setPeers(users => [...users, { peerID: payload.callerID, peer }]);
                toast.success("A user joined the meeting");
            });

            socketRef.current.on('receiving-returned-signal', payload => {
                console.log(`🔄 Received signal from:`, payload.id);
                const item = peersRef.current.find(p => p.peerID === payload.id);
                if (item) {
                    item.peer.signal(payload.signal);
                } else {
                    console.warn(`⚠️ Could not find peer for signal:`, payload.id);
                }
            });

            socketRef.current.on('user-left', id => {
                console.log(`👋 User left:`, id);
                const peerObj = peersRef.current.find(p => p.peerID === id);
                if (peerObj) peerObj.peer.destroy();
                const newPeers = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = newPeers;
                setPeers(newPeers);
                toast("User disconnected");
            });

            // Chat events
            socketRef.current.on('chat-message', ({ userId, userName, message, timestamp }) => {
                setMessages(prev => [...prev, { userId, userName, message, timestamp }]);
                if (!showChat) setUnreadCount(prev => prev + 1);
            });

            // Hand raise events
            socketRef.current.on('hand-raised', ({ userId, userName, raised }) => {
                toast(`${userName} ${raised ? 'raised' : 'lowered'} their hand`);
            });

            // Reaction events
            socketRef.current.on('reaction-sent', ({ userId, userName, reaction }) => {
                toast(`${userName} reacted with ${reaction}`);
            });
            
            setJoined(true);
            
            // Auto-enter fullscreen on join
            setTimeout(() => {
                enterFullscreen();
            }, 500); // Small delay to ensure DOM is ready
        };

        if (stream) {
            proceedJoin(stream);
        } else {
            navigator.mediaDevices.getUserMedia({ 
                video: { deviceId: selectedVideo ? { exact: selectedVideo } : undefined },
                audio: { deviceId: selectedAudio ? { exact: selectedAudio } : undefined }
            })
            .then(currentStream => {
                console.log("✅ Camera Access Granted", currentStream);
                setStream(currentStream);
                proceedJoin(currentStream);
            })
            .catch(err => {
                console.error("Error accessing media devices:", err);
                toast.error("Could not access camera/microphone");
            });
        }
    };

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('sending-signal', { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('returning-signal', { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    const toggleMic = () => {
        setMicOn(!micOn);
        if (stream) stream.getAudioTracks()[0].enabled = !micOn;
    };

    const toggleCam = () => {
        setCamOn(!camOn);
        // Only toggle video track if NOT screen sharing
        // When screen sharing, the stream is the screen stream, not camera
        if (stream && !isScreenSharing) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !camOn;
            }
        }
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: { cursor: "always" },
                    audio: false
                });

                // Stop screen sharing when user clicks browser's stop button
                displayStream.getVideoTracks()[0].onended = () => {
                    stopScreenShare();
                };

                setScreenStream(displayStream);
                
                // Replace video track in stream
                const videoTrack = displayStream.getVideoTracks()[0];
                const sender = peersRef.current[0]?.peer?._pc?.getSenders()?.find(s => 
                    s.track?.kind === 'video'
                );
                
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }

                // Update local stream
                const audioTrack = stream.getAudioTracks()[0];
                const newStream = new MediaStream([videoTrack, audioTrack]);
                setStream(newStream);
                setIsScreenSharing(true);
                toast.success("Screen sharing started");
            } catch (err) {
                console.error("Error sharing screen:", err);
                toast.error("Could not start screen sharing");
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }

        // Restore original camera stream
        if (originalStreamRef.current) {
            const videoTrack = originalStreamRef.current.getVideoTracks()[0];
            const sender = peersRef.current[0]?.peer?._pc?.getSenders()?.find(s => 
                s.track?.kind === 'video'
            );
            
            if (sender) {
                sender.replaceTrack(videoTrack);
            }

            const audioTrack = originalStreamRef.current.getAudioTracks()[0];
            const newStream = new MediaStream([videoTrack, audioTrack]);
            setStream(newStream);
        }

        setIsScreenSharing(false);
        setScreenStream(null);
        toast("Screen sharing stopped");
    };

    const switchCamera = async (deviceId) => {
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
                audio: { deviceId: selectedAudio ? { exact: selectedAudio } : undefined }
            });

            // Replace tracks
            const videoTrack = newStream.getVideoTracks()[0];
            const audioTrack = newStream.getAudioTracks()[0];
            
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            peersRef.current.forEach(({ peer }) => {
                const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
                if (sender) sender.replaceTrack(videoTrack);
            });

            setStream(newStream);
            originalStreamRef.current = newStream;
            setSelectedVideo(deviceId);
            toast.success("Camera switched");
        } catch (err) {
            console.error("Error switching camera:", err);
            toast.error("Could not switch camera");
        }
    };

    const switchMicrophone = async (deviceId) => {
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedVideo ? { exact: selectedVideo } : undefined },
                audio: { deviceId: { exact: deviceId } }
            });

            const audioTrack = newStream.getAudioTracks()[0];
            
            if (stream) {
                const oldAudio = stream.getAudioTracks()[0];
                if (oldAudio) oldAudio.stop();
            }

            peersRef.current.forEach(({ peer }) => {
                const sender = peer._pc.getSenders().find(s => s.track?.kind === 'audio');
                if (sender) sender.replaceTrack(audioTrack);
            });

            const videoTrack = stream.getVideoTracks()[0];
            const updatedStream = new MediaStream([videoTrack, audioTrack]);
            setStream(updatedStream);
            originalStreamRef.current = updatedStream;
            setSelectedAudio(deviceId);
            toast.success("Microphone switched");
        } catch (err) {
            console.error("Error switching microphone:", err);
            toast.error("Could not switch microphone");
        }
    };

    const sendMessage = () => {
        if (!messageInput.trim()) return;
        
        const message = {
            userId: user.id,
            userName: user.name,
            message: messageInput,
            timestamp: new Date().toISOString()
        };

        socketRef.current.emit('chat-message', message);
        setMessages(prev => [...prev, message]);
        setMessageInput('');
    };

    const toggleHandRaise = () => {
        const newState = !handRaised;
        setHandRaised(newState);
        socketRef.current.emit('hand-raised', {
            userId: user.id,
            userName: user.name,
            raised: newState
        });
        toast(newState ? "Hand raised" : "Hand lowered");
    };

    const sendReaction = (reaction) => {
        socketRef.current.emit('reaction-sent', {
            userId: user.id,
            userName: user.name,
            reaction
        });
        setShowMoreMenu(false);
        toast(`Sent ${reaction}`);
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    };

    const enterFullscreen = () => {
        const container = fullscreenContainerRef.current;
        if (!container) return;

        try {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } catch (err) {
            console.error("Error entering fullscreen:", err);
        }
    };

    const exitFullscreen = () => {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        } catch (err) {
            console.error("Error exiting fullscreen:", err);
        }
    };

    // Listen for fullscreen changes from browser (e.g., ESC key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.mozFullScreenElement || 
                document.msFullscreenElement);
            setIsFullscreen(isCurrentlyFullscreen);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    const leaveCall = () => {
        // Exit fullscreen before leaving
        if (isFullscreen) {
            exitFullscreen();
        }
        
        setJoined(false);
        setPeers([]);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        
        // Small delay to ensure fullscreen exits before reload
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    // Initialize camera on mount for Lobby Preview
    useEffect(() => {
        if (!joined) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(currentStream => {
                    setStream(currentStream);
                    originalStreamRef.current = currentStream;
                    setMicOn(true);
                    setCamOn(true);
                })
                .catch(err => {
                    console.error("Lobby Media Error:", err);
                    toast.error("Could not access camera/mic for preview");
                });
        }
    }, [joined]);

    // Lobby view (before joining)
    if (!joined) {
        return (
            <div className="flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-8 h-full min-h-[600px] w-full max-w-6xl mx-auto">
                {/* Left: Video Preview */}
                <div className="w-full md:w-3/5 flex flex-col items-center">
                     <div className="relative w-full aspect-video bg-[#202124] rounded-2xl overflow-hidden shadow-2xl border border-[#303134]">
                        {stream ? (
                            <video 
                                muted 
                                ref={setVideoRef} 
                                autoPlay 
                                playsInline 
                                className={`w-full h-full object-cover transition-transform duration-500 ${!camOn && 'opacity-0'}`}
                            />
                        ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                <span className="animate-pulse">Camera is starting...</span>
                             </div>
                        )}
                        
                        {/* Cam Off Placeholder */}
                        {!camOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
                                <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-200 text-3xl font-bold">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                            </div>
                        )}

                        {/* Lobby Controls in Video */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                             <ControlBtn 
                                onClick={toggleMic} 
                                active={micOn} 
                                iconOn={<Mic />} 
                                iconOff={<MicOff />} 
                                color="red"
                                activeClass="bg-white/10 hover:bg-white/20 text-white border border-transparent"
                             />
                             <ControlBtn 
                                onClick={toggleCam} 
                                active={camOn} 
                                iconOn={<Video />} 
                                iconOff={<VideoOff />} 
                                color="red"
                                activeClass="bg-white/10 hover:bg-white/20 text-white border border-transparent"
                             />
                        </div>

                         {/* Audio Indicator */}
                        <div className="absolute bottom-4 left-4">
                              {!micOn && <div className="bg-black/60 px-2 py-1 rounded text-xs text-red-400 flex items-center gap-1"><MicOff className="w-3 h-3"/> Mic Off</div>}
                        </div>
                     </div>
                     <p className="mt-4 text-gray-400 text-sm">Check your audio and video</p>
                </div>

                {/* Right: Join Options */}
                <div className="w-full md:w-2/5 flex flex-col items-center md:items-start space-y-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-normal text-white mb-2">Ready to join?</h1>
                        <p className="text-gray-400">No one else is here</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <button 
                             onClick={createMeeting}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium px-8 py-3 rounded-full transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Start New Meeting
                        </button>
                        
                        <div className="flex items-center gap-2 w-full">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-gray-500 text-sm">or</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Layout className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-[#202124] text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-[#202124] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all"
                                    placeholder="Enter meeting code"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                />
                                <button 
                                    onClick={() => joinRoom(inputCode)}
                                    disabled={!inputCode}
                                    className="px-4 text-purple-400 font-bold hover:bg-purple-500/10 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                     
                    {teamId && (
                         <div className="w-full max-w-sm pt-4 border-t border-white/10 mt-4">
                            <p className="text-sm text-gray-500 mb-3">Team Lounge</p>
                             <button onClick={() => joinRoom(teamId)} className="w-full bg-[#202124] hover:bg-[#303134] text-white py-3 px-4 rounded-xl flex items-center justify-between group transition-colors">
                                 <span className="flex items-center gap-3">
                                     <div className="bg-green-500/20 p-2 rounded-full text-green-400 group-hover:bg-green-500/30"><Users className="w-4 h-4"/></div>
                                     <span className="font-medium">"{teamId}" Lounge</span>
                                 </span>
                                 <span className="text-gray-400 group-hover:text-white transition-colors">Join Now &rarr;</span>
                             </button>
                         </div>
                    )}
                </div>
            </div>
        );
    }

    // Meeting view (after joining)
    const getLayoutClass = () => {
        const totalParticipants = peers.length + 1;
        
        if (layout === 'sidebar' || layout === 'spotlight') {
            return 'flex flex-col';
        }
        
        // Grid layout - FORCE 2 columns on mobile to match Google Meet
        // Mobile (<640px): Always 2 columns
        // Desktop (>=640px): Dynamic based on participant count
        if (totalParticipants === 1) return 'grid grid-cols-1';
        if (totalParticipants === 2) return 'grid grid-cols-1 sm:grid-cols-2';
        // Force 2 columns on mobile, more on desktop
        if (totalParticipants <= 4) return 'grid grid-cols-2';
        if (totalParticipants <= 9) return 'grid grid-cols-2 sm:grid-cols-3';
        return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    };

    return (
        <div ref={fullscreenContainerRef} className="flex h-full min-h-[400px] md:min-h-[600px] bg-black/40 md:rounded-2xl border-0 md:border border-white/10 overflow-hidden relative">
            
            {/* Header - Ultra compact on mobile */}
            <div className="bg-black/40 p-1.5 sm:p-2 md:p-4 flex justify-between items-center border-b border-white/10 absolute top-0 w-full z-10 backdrop-blur-sm">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
                        <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm hidden sm:inline">Code:</span>
                        <div className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-white/5 rounded text-[10px] sm:text-xs md:text-sm font-mono font-bold flex items-center gap-0.5 sm:gap-1 md:gap-2 border border-white/10">
                            <span className="hidden sm:inline">{meetingCode}</span>
                            <span className="sm:hidden text-[10px]">{meetingCode.substring(0, 4)}</span>
                            <button onClick={() => { navigator.clipboard.writeText(meetingCode); toast.success('Code copied'); }} className="hover:text-purple-400 transition-colors touch-manipulation">
                                <Copy className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                    <button 
                        onClick={copyInvite}
                        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-[10px] sm:text-xs md:text-sm font-bold px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg transition-colors flex items-center gap-0.5 sm:gap-1 md:gap-2 shadow-lg shadow-purple-500/20 touch-manipulation"
                    >
                        <Share2 className="w-2.5 sm:w-3 md:w-4 h-2.5 sm:h-3 md:h-4" />
                        <span className="hidden sm:inline">Invite</span>
                    </button>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 bg-black/30 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full border border-white/5">
                        {peers.length + 1}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Grid - Optimized for mobile */}
                <div className="flex-1 flex flex-col overflow-hidden pb-16 sm:pb-20 md:pb-24">
                    <div className={`${getLayoutClass()} gap-2 sm:gap-4 p-2 sm:p-4 flex-1 pt-12 sm:pt-16 md:pt-20 overflow-y-auto`}>
                        {layout === 'spotlight' && pinnedPeer ? (
                            <>
                                {/* Spotlight: Pinned user large */}
                                <div className="w-full h-full">
                                    <VideoCard peer={pinnedPeer.peer} large />
                                </div>
                                {/* Others small */}
                                <div className="flex gap-2 p-2 overflow-x-auto">
                                    <UserVideoTile stream={stream} isScreenSharing={isScreenSharing} setVideoRef={setVideoRef} camOn={camOn} user={user} videoError={videoError} small />
                                    {peers.filter(p => p.peerID !== pinnedPeer.peerID).map((peer, index) => (
                                        <VideoCard key={index} peer={peer.peer} small />
                                    ))}
                                </div>
                            </>
                        ) : layout === 'sidebar' ? (
                            <>
                                {/* Sidebar: Main view + strip */}
                                <div className="flex-1">
                                    <UserVideoTile stream={stream} isScreenSharing={isScreenSharing} setVideoRef={setVideoRef} camOn={camOn} user={user} videoError={videoError} />
                                </div>
                                <div className="flex gap-2 p-2 overflow-x-auto">
                                    {peers.map((peer, index) => (
                                        <VideoCard key={index} peer={peer.peer} small />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Grid: All equal */}
                                <UserVideoTile stream={stream} isScreenSharing={isScreenSharing} setVideoRef={setVideoRef} camOn={camOn} user={user} videoError={videoError} />
                                {peers.map((peer, index) => (
                                    <VideoCard key={index} peer={peer.peer} onPin={() => {
                                        setPinnedPeer(peer);
                                        setLayout('spotlight');
                                    }} />
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                {/* Chat Panel - Mobile: Bottom sheet, Desktop: Side panel */}
                {showChat && (
                    <div className="fixed md:absolute bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-0 md:top-0 w-full md:w-80 h-[70vh] md:h-full bg-[#202124] border-t md:border-t-0 md:border-l border-white/10 flex flex-col z-30 rounded-t-2xl md:rounded-none shadow-2xl" style={{ maxHeight: '70vh' }}>
                        <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                            <h3 className="font-bold text-white">Chat</h3>
                            <button onClick={() => { setShowChat(false); setUnreadCount(0); }} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <MessageSquare className="w-12 h-12 text-gray-600 mb-2" />
                                    <p className="text-gray-500 text-sm">No messages yet</p>
                                    <p className="text-gray-600 text-xs mt-1">Send a message to start the conversation</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isOwnMessage = msg.userId === user?.id;
                                    return (
                                        <div key={idx} className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                                                    {msg.userName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            </div>
                                            
                                            {/* Message bubble */}
                                            <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <span className={`text-xs font-semibold ${isOwnMessage ? 'text-purple-400' : 'text-blue-400'}`}>
                                                        {isOwnMessage ? 'You' : msg.userName}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className={`rounded-2xl px-3 py-2 ${
                                                    isOwnMessage 
                                                        ? 'bg-purple-600/40 rounded-tr-sm' 
                                                        : 'bg-white/10 rounded-tl-sm'
                                                }`}>
                                                    <p className="text-sm text-white break-words">{msg.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="p-4 border-t border-white/10 flex-shrink-0 bg-[#202124]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                                <button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls - Google Meet Exact Mobile Design */}
            <div className="p-4 sm:p-4 md:p-6 flex justify-between items-center gap-4 bg-black/90 md:bg-black/40 backdrop-blur-md border-t border-white/10 fixed md:absolute bottom-0 w-full z-20">
                
                {/* Mobile: ONLY 4 buttons (Mic, Cam, More, Leave) */}
                {/* Desktop: Show all controls */}
                
                {/* Left: Mic & Camera - Always visible */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleMic}
                        title={micOn ? "Mute" : "Unmute"}
                        className={`p-4 rounded-full transition-all min-w-[56px] min-h-[56px] flex items-center justify-center ${
                            micOn ? 'bg-[#3C4043] hover:bg-[#5F6368]' : 'bg-[#EA4335] hover:bg-[#D33B2C]'
                        }`}
                    >
                        {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                    </button>
                    
                    <button 
                        onClick={toggleCam}
                        title={camOn ? "Turn off camera" : "Turn on camera"}
                        className={`p-4 rounded-full transition-all min-w-[56px] min-h-[56px] flex items-center justify-center ${
                            camOn ? 'bg-[#3C4043] hover:bg-[#5F6368]' : 'bg-[#EA4335] hover:bg-[#D33B2C]'
                        }`}
                    >
                        {camOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    </button>

                    {/* Desktop only: Additional controls */}
                    <button 
                        onClick={toggleScreenShare}
                        title={isScreenSharing ? "Stop sharing" : "Share screen"}
                        className={`hidden md:flex p-4 rounded-full transition-all items-center justify-center ${
                            isScreenSharing ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#3C4043] hover:bg-[#5F6368]'
                        }`}
                    >
                        {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </button>

                    <button 
                        onClick={() => { setShowChat(!showChat); if (!showChat) setUnreadCount(0); }}
                        title="Toggle chat"
                        className="hidden md:flex p-4 rounded-full bg-[#3C4043] hover:bg-[#5F6368] transition-all relative items-center justify-center"
                    >
                        <MessageSquare className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Right: More & Leave - Always visible */}
                <div className="flex items-center gap-3">
                    {/* More Options */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            title="More options"
                            className="p-4 rounded-full bg-[#3C4043] hover:bg-[#5F6368] transition-all min-w-[56px] min-h-[56px] md:min-w-[48px] md:min-h-[48px] flex items-center justify-center"
                        >
                            <MoreVertical className="w-6 h-6 md:w-5 md:h-5" />
                        </button>

                        {showMoreMenu && (
                            <>
                                {/* Click outside to close */}
                                <div 
                                    className="fixed inset-0 z-[100]" 
                                    onClick={() => setShowMoreMenu(false)}
                                />
                                
                                {/* Menu - Fixed positioning for mobile */}
                                <div 
                                    className="fixed bottom-[80px] right-4 md:absolute md:bottom-full md:right-0 md:mb-2 bg-[#303134] rounded-lg shadow-2xl border border-white/10 p-2 min-w-[200px] max-w-[280px] z-[101]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button 
                                        onClick={() => {
                                            toggleHandRaise();
                                            setShowMoreMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left"
                                    >
                                        <Hand className="w-5 h-5" />
                                        <span className="text-sm font-medium">{handRaised ? 'Lower hand' : 'Raise hand'}</span>
                                    </button>
                                    <div className="border-t border-white/10 my-2"></div>
                                    <p className="text-xs text-gray-500 px-4 py-1 font-semibold uppercase">Reactions</p>
                                    <button onClick={() => { sendReaction('👍'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left">
                                        <span className="text-2xl">👍</span>
                                        <span className="text-sm">Thumbs up</span>
                                    </button>
                                    <button onClick={() => { sendReaction('❤️'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left">
                                        <span className="text-2xl">❤️</span>
                                        <span className="text-sm">Heart</span>
                                    </button>
                                    <button onClick={() => { sendReaction('😂'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left">
                                        <span className="text-2xl">😂</span>
                                        <span className="text-sm">Laugh</span>
                                    </button>
                                    <button onClick={() => { sendReaction('🎉'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left">
                                        <span className="text-2xl">🎉</span>
                                        <span className="text-sm">Party</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Leave Button - Google Meet style (red, prominent) */}
                    <button 
                        onClick={leaveCall}
                        className="bg-[#EA4335] hover:bg-[#D33B2C] text-white p-4 rounded-full font-bold shadow-lg flex items-center gap-2 min-w-[56px] min-h-[56px]"
                    >
                        <PhoneOff className="w-6 h-6" />
                        <span className="hidden md:inline text-sm">Leave</span>
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50" onClick={() => setShowSettings(false)}>
                    <div className="bg-[#303134] rounded-t-2xl md:rounded-2xl shadow-2xl border-t md:border border-white/10 p-4 md:p-6 w-full md:max-w-md md:w-full m-0 md:m-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-white">Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white touch-manipulation p-2">
                                <X className="w-5 md:w-6 h-5 md:h-6" />
                            </button>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            {/* Microphone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Microphone</label>
                                <select 
                                    value={selectedAudio}
                                    onChange={(e) => switchMicrophone(e.target.value)}
                                    className="w-full bg-[#202124] border border-white/10 rounded-lg px-3 py-2.5 md:py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                                >
                                    {audioDevices.map(device => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Microphone ${device.deviceId.substring(0, 5)}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Camera */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Camera</label>
                                <select 
                                    value={selectedVideo}
                                    onChange={(e) => switchCamera(e.target.value)}
                                    className="w-full bg-[#202124] border border-white/10 rounded-lg px-3 py-2.5 md:py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                                >
                                    {videoDevices.map(device => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Camera ${device.deviceId.substring(0, 5)}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Speakers */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Speakers</label>
                                <select 
                                    value={selectedAudioOutput}
                                    onChange={(e) => setSelectedAudioOutput(e.target.value)}
                                    className="w-full bg-[#202124] border border-white/10 rounded-lg px-3 py-2.5 md:py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                                >
                                    {audioOutputDevices.map(device => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Speaker ${device.deviceId.substring(0, 5)}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// User's own video tile component
const UserVideoTile = ({ stream, isScreenSharing, setVideoRef, camOn, user, videoError, small = false, large = false }) => {
    return (
        <div className={`relative bg-black rounded-xl overflow-hidden shadow-2xl border border-purple-500/30 group ${small ? 'w-32 h-24' : large ? 'w-full h-full' : 'aspect-video'}`}>
            {/* Video element - only show when camera is on */}
            {camOn && (
                <video 
                    key={stream ? stream.id : 'no-stream'}
                    muted 
                    ref={setVideoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover ${!isScreenSharing ? 'transform scale-x-[-1]' : ''}`}
                />
            )}
            
            {/* Camera Off Placeholder */}
            {!camOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
                    <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-200 text-3xl font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                </div>
            )}
            
            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-bold">You</div>
            
            {/* Camera off indicator */}
            {!camOn && (
                <div className="absolute top-3 left-3 bg-red-500/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                    <VideoOff className="w-3 h-3" /> Camera Off
                </div>
            )}

            {videoError && camOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <button 
                        onClick={() => {
                            if(userVideo.current) {
                                userVideo.current.muted = true;
                                userVideo.current.play().then(() => setVideoError(false));
                            }
                        }}
                        className="bg-white text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Video className="w-5 h-5" /> Start Video
                    </button>
                </div>
            )}
        </div>
    );
};

// Peer video card component
const VideoCard = ({ peer, small = false, large = false, onPin }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            if (ref.current) {
                ref.current.srcObject = stream;
            }
        });
    }, [peer]);

    return (
        <div className={`relative bg-black rounded-xl overflow-hidden shadow-lg border border-white/10 group ${small ? 'w-32 h-24' : large ? 'w-full h-full' : 'aspect-video'}`}>
            <video playsInline autoPlay ref={ref} className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs text-gray-300">User</div>
            {onPin && !small && (
                <button 
                    onClick={onPin}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Pin to spotlight"
                >
                    <Maximize className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// Control button component
const ControlBtn = ({ onClick, active, iconOn, iconOff, color = "red", title, activeClass }) => {
    return (
        <button 
            onClick={onClick} 
            title={title}
            className={`p-3 rounded-full transition-all duration-200 ${
                activeClass ? (active ? activeClass : activeClass) : (
                    active 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : `bg-${color}-500/20 text-${color}-500 hover:bg-${color}-500/30`
                )
            }`}
        >
            {active ? iconOn : (iconOff || iconOn)}
        </button>
    )
}

export default VideoConnect;

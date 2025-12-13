import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { webrtcConfig } from '../utils/webrtcConfig';

/**
 * Custom hook for WebRTC peer connections and signaling
 */
export const useWebRTC = (meetingCode, localStream, token) => {
    const [peers, setPeers] = useState(new Map());
    const [participants, setParticipants] = useState([]);
    const [connected, setConnected] = useState(false);

    const socketRef = useRef(null);
    const peersRef = useRef(new Map());

    // Initialize socket connection
    useEffect(() => {
        if (!meetingCode || !token) return;

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            setConnected(true);

            // Join meeting
            socket.emit('join-meeting', { meetingCode });
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setConnected(false);
        });

        socket.on('error', ({ message }) => {
            console.error('Socket error:', message);
        });

        // Participants list (existing users)
        socket.on('participants-list', ({ participants: participantsList }) => {
            console.log('👥 Participants list:', participantsList);
            setParticipants(participantsList);

            // Create peer connections for each existing participant
            participantsList.forEach(participant => {
                createPeerConnection(participant.socketId, true);
            });
        });

        // New user joined
        socket.on('user-joined', ({ socketId, userName }) => {
            console.log('✅ User joined:', userName, socketId);
            createPeerConnection(socketId, false);
        });

        // Receive offer
        socket.on('offer', async ({ from, offer, userName }) => {
            console.log('📨 Received offer from:', userName);
            const peer = peersRef.current.get(from);
            if (peer) {
                await peer.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                socket.emit('answer', { to: from, answer });
            }
        });

        // Receive answer
        socket.on('answer', async ({ from, answer }) => {
            console.log('📨 Received answer from:', from);
            const peer = peersRef.current.get(from);
            if (peer) {
                await peer.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // Receive ICE candidate
        socket.on('ice-candidate', async ({ from, candidate }) => {
            const peer = peersRef.current.get(from);
            if (peer && candidate) {
                try {
                    await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error('Error adding ICE candidate:', err);
                }
            }
        });

        // User left
        socket.on('user-left', ({ socketId, userName }) => {
            console.log('👋 User left:', userName);
            const peer = peersRef.current.get(socketId);
            if (peer) {
                peer.close();
                peersRef.current.delete(socketId);
                setPeers(new Map(peersRef.current));
            }
        });

        return () => {
            socket.disconnect();
            // Close all peer connections
            peersRef.current.forEach(peer => peer.close());
            peersRef.current.clear();
        };
    }, [meetingCode, token]);

    // Create peer connection
    const createPeerConnection = useCallback(async (socketId, createOffer) => {
        try {
            const peer = new RTCPeerConnection(webrtcConfig);
            peersRef.current.set(socketId, peer);

            // Add local stream tracks
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    peer.addTrack(track, localStream);
                });
            }

            // Handle incoming stream
            peer.ontrack = (event) => {
                console.log('🎥 Received remote track from:', socketId);
                const remoteStream = event.streams[0];

                setPeers(prevPeers => {
                    const newPeers = new Map(prevPeers);
                    newPeers.set(socketId, {
                        connection: peer,
                        stream: remoteStream
                    });
                    return newPeers;
                });
            };

            // Handle ICE candidates
            peer.onicecandidate = (event) => {
                if (event.candidate && socketRef.current) {
                    socketRef.current.emit('ice-candidate', {
                        to: socketId,
                        candidate: event.candidate
                    });
                }
            };

            // Handle connection state
            peer.onconnectionstatechange = () => {
                console.log(`Peer connection state (${socketId}):`, peer.connectionState);

                if (peer.connectionState === 'failed' || peer.connectionState === 'disconnected') {
                    console.log('⚠️ Connection failed, attempting restart...');
                    // Implement ICE restart if needed
                }
            };

            // Create and send offer if initiator
            if (createOffer) {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                socketRef.current.emit('offer', { to: socketId, offer });
            }

            peersRef.current.set(socketId, peer);
            setPeers(new Map(peersRef.current));

        } catch (err) {
            console.error('Error creating peer connection:', err);
        }
    }, [localStream]);

    // Leave meeting
    const leaveMeeting = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('leave-meeting');
            socketRef.current.disconnect();
        }

        peersRef.current.forEach(peer => peer.close());
        peersRef.current.clear();
        setPeers(new Map());
    }, []);

    return {
        peers,
        participants,
        connected,
        socket: socketRef.current,
        leaveMeeting
    };
};

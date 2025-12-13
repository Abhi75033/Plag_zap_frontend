import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mediaConstraints, screenShareConstraints } from '../utils/webrtcConfig';

/**
 * Custom hook for managing media devices (camera, mic, screen share)
 */
export const useMediaDevices = () => {
    const [localStream, setLocalStream] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [devices, setDevices] = useState({ audio: [], video: [] });
    const [error, setError] = useState(null);

    const screenStreamRef = useRef(null);
    const videoStreamRef = useRef(null);

    // Get user media on mount
    useEffect(() => {
        let mounted = true;

        const getUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
                if (mounted) {
                    setLocalStream(stream);
                    videoStreamRef.current = stream;
                    console.log('✅ Got user media:', stream.id);
                }
            } catch (err) {
                console.error('❌ Error getting user media:', err);
                if (mounted) {
                    setError(err.message);
                }
            }
        };

        getUserMedia();
        enumerateDevices();

        return () => {
            mounted = false;
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Enumerate devices
    const enumerateDevices = async () => {
        try {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            setDevices({
                audio: deviceList.filter(d => d.kind === 'audioinput'),
                video: deviceList.filter(d => d.kind === 'videoinput')
            });
        } catch (err) {
            console.error('Error enumerating devices:', err);
        }
    };

    // Toggle audio
    const toggleAudio = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !audioEnabled;
            });
            setAudioEnabled(!audioEnabled);
            return !audioEnabled;
        }
        return audioEnabled;
    };

    // Toggle video
    const toggleVideo = async () => {
        if (!localStream) return videoEnabled;

        // Can't toggle camera while screen sharing - screen share uses video track
        if (isScreenSharing) {
            console.log('Stop screen sharing first to toggle camera');
            return videoEnabled;
        }

        // If turning ON the camera
        if (!videoEnabled) {
            try {
                // Get new video stream
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: mediaConstraints.video
                });
                const videoTrack = stream.getVideoTracks()[0];

                // Remove old video track if exists
                const oldTrack = localStream.getVideoTracks()[0];
                if (oldTrack) {
                    oldTrack.stop();
                    localStream.removeTrack(oldTrack);
                }

                // Add new video track
                localStream.addTrack(videoTrack);
                videoTrack.enabled = true;
                setVideoEnabled(true);
                return true;
            } catch (err) {
                console.error('Error re-enabling camera:', err);
                setError(err.message);
                return false;
            }
        } else {
            // If turning OFF the camera
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = false;
                setVideoEnabled(false);
            }
            return false;
        }
    };

    // Start screen sharing
    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia(screenShareConstraints);
            screenStreamRef.current = screenStream;
            const screenTrack = screenStream.getVideoTracks()[0];

            // Store current camera track
            if (localStream) {
                const cameraTrack = localStream.getVideoTracks()[0];
                videoStreamRef.current = localStream.clone(); // Store camera stream

                // Replace camera track with screen track
                if (cameraTrack) {
                    cameraTrack.stop();
                    localStream.removeTrack(cameraTrack);
                }

                localStream.addTrack(screenTrack);
                setIsScreenSharing(true);
                setVideoEnabled(true); // Screen share counts as "video on"

                // Listen for user stopping share via browser UI
                screenTrack.onended = () => {
                    stopScreenShare();
                };

                return screenStream;
            }
        } catch (err) {
            console.error('Error starting screen share:', err);
            return null;
        }
    };

    // Stop screen sharing
    const stopScreenShare = async () => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }

        // Remove screen share track
        if (localStream) {
            const screenTrack = localStream.getVideoTracks()[0];
            if (screenTrack) {
                screenTrack.stop();
                localStream.removeTrack(screenTrack);
            }
        }

        // Restart camera if it was on before
        if (videoStreamRef.current) {
            try {
                // Get fresh camera stream
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: mediaConstraints.video
                });
                const videoTrack = stream.getVideoTracks()[0];

                if (localStream) {
                    localStream.addTrack(videoTrack);
                }

                setIsScreenSharing(false);
                setVideoEnabled(true);
            } catch (err) {
                console.error('Error restarting camera after screen share:', err);
                setIsScreenSharing(false);
                setVideoEnabled(false);
            }
        } else {
            setIsScreenSharing(false);
            setVideoEnabled(false);
        }
    };

    // Change device
    const changeDevice = async (deviceId, kind) => {
        try {
            const constraints = kind === 'audio'
                ? { audio: { deviceId: { exact: deviceId } } }
                : { video: { deviceId: { exact: deviceId }, ...mediaConstraints.video } };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const newTrack = kind === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

            if (localStream) {
                const oldTrack = kind === 'audio'
                    ? localStream.getAudioTracks()[0]
                    : localStream.getVideoTracks()[0];

                if (oldTrack) {
                    oldTrack.stop();
                    localStream.removeTrack(oldTrack);
                }

                localStream.addTrack(newTrack);
            }
        } catch (err) {
            console.error(`Error changing ${kind} device:`, err);
        }
    };

    return {
        localStream,
        audioEnabled,
        videoEnabled,
        isScreenSharing,
        devices,
        error,
        toggleAudio,
        toggleVideo,
        startScreenShare,
        stopScreenShare,
        changeDevice
    };
};

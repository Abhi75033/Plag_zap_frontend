/**
 * WebRTC Configuration
 * Google STUN servers + optional TURN for production
 */

export const webrtcConfig = {
    iceServers: [
        // Google STUN servers
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },

        // Add TURN servers for production (uncomment and configure)
        // {
        //     urls: 'turn:your-turn-server.com:3478',
        //     username: 'your-username',
        //     credential: 'your-password'
        // }
    ],
    iceCandidatePoolSize: 10
};

export const mediaConstraints = {
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }
};

export const screenShareConstraints = {
    video: {
        cursor: 'always'
    },
    audio: false
};

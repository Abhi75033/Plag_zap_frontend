/**
 * Active Speaker Detection
 * Uses Web Audio API to detect which participant is speaking
 */

export class ActiveSpeakerDetector {
    constructor() {
        this.audioContexts = new Map();
        this.analyzers = new Map();
        this.volumes = new Map();
        this.threshold = 0.02; // Minimum volume to consider as speaking
        this.checkInterval = null;
        this.onSpeakerChange = null;
        this.currentSpeaker = null;
    }

    // Add a stream to monitor
    addStream(streamId, stream) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 512;
            analyzer.smoothingTimeConstant = 0.8;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyzer);

            this.audioContexts.set(streamId, audioContext);
            this.analyzers.set(streamId, analyzer);
            this.volumes.set(streamId, 0);
        } catch (err) {
            console.error('Error adding stream for active speaker detection:', err);
        }
    }

    // Remove a stream
    removeStream(streamId) {
        const audioContext = this.audioContexts.get(streamId);
        if (audioContext) {
            audioContext.close();
            this.audioContexts.delete(streamId);
        }
        this.analyzers.delete(streamId);
        this.volumes.delete(streamId);
    }

    // Get volume for a stream
    getVolume(streamId) {
        const analyzer = this.analyzers.get(streamId);
        if (!analyzer) return 0;

        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(dataArray);

        // Calculate average volume
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;

        return average / 255; // Normalize to 0-1
    }

    // Start detection
    start(callback) {
        this.onSpeakerChange = callback;

        this.checkInterval = setInterval(() => {
            let maxVolume = 0;
            let loudestStream = null;

            // Check all streams
            this.analyzers.forEach((analyzer, streamId) => {
                const volume = this.getVolume(streamId);
                this.volumes.set(streamId, volume);

                if (volume > maxVolume && volume > this.threshold) {
                    maxVolume = volume;
                    loudestStream = streamId;
                }
            });

            // Speaker changed
            if (loudestStream !== this.currentSpeaker) {
                this.currentSpeaker = loudestStream;
                if (this.onSpeakerChange) {
                    this.onSpeakerChange(loudestStream);
                }
            }
        }, 200); // Check every 200ms
    }

    // Stop detection
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }

        // Close all audio contexts
        this.audioContexts.forEach(context => context.close());
        this.audioContexts.clear();
        this.analyzers.clear();
        this.volumes.clear();
    }

    // Get current speaker
    getCurrentSpeaker() {
        return this.currentSpeaker;
    }
}

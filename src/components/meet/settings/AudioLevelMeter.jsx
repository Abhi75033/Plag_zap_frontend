import React, { useState, useEffect, useRef } from 'react';

/**
 * Audio Level Meter Component
 * Real-time visualization of microphone input
 */
const AudioLevelMeter = ({ stream }) => {
    const [level, setLevel] = useState(0);
    const animationRef = useRef(null);
    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);

    useEffect(() => {
        if (!stream) return;

        // Create audio context and analyser
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Start monitoring
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const normalized = Math.min(100, (average / 255) * 100);
            setLevel(normalized);
            animationRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [stream]);

    return (
        <div className="w-full h-2 bg-[#5f6368] rounded-full overflow-hidden">
            <div
                className="h-full bg-[#1a73e8] transition-all duration-100 rounded-full"
                style={{ width: `${level}%` }}
            />
        </div>
    );
};

export default AudioLevelMeter;

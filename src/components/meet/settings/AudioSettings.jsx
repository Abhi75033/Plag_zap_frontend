import React, { useState, useEffect } from 'react';
import AudioLevelMeter from './AudioLevelMeter';

/**
 * Audio Settings Tab
 * Microphone, speakers, volume, enhancements
 */
const AudioSettings = ({ localStream }) => {
    const [devices, setDevices] = useState({ microphones: [], speakers: [] });
    const [selectedMic, setSelectedMic] = useState('default');
    const [selectedSpeaker, setSelectedSpeaker] = useState('default');
    const [volume, setVolume] = useState(100);
    const [noiseSuppression, setNoiseSuppression] = useState(true);
    const [echoCancellation, setEchoCancellation] = useState(true);
    const [testingAudio, setTestingAudio] = useState(false);

    // Load devices
    useEffect(() => {
        loadDevices();
        
        // Listen for device changes
        navigator.mediaDevices.addEventListener('devicechange', loadDevices);
        return () => navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
    }, []);

    const loadDevices = async () => {
        try {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            setDevices({
                microphones: deviceList.filter(d => d.kind === 'audioinput'),
                speakers: deviceList.filter(d => d.kind === 'audiooutput')
            });
        } catch (err) {
            console.error('Error loading devices:', err);
        }
    };

    const handleMicChange = (deviceId) => {
        setSelectedMic(deviceId);
        localStorage.setItem('preferredMicrophone', deviceId);
        // TODO: Actually switch device in useMediaDevices
    };

    const handleSpeakerChange = (deviceId) => {
        setSelectedSpeaker(deviceId);
        localStorage.setItem('preferredSpeaker', deviceId);
    };

    const testSpeakers = () => {
        setTestingAudio(true);
        const audio = new Audio('/notification.mp3'); // You'll need to add this sound
        audio.play().catch(err => console.error('Test audio failed:', err));
        setTimeout(() => setTestingAudio(false), 1000);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        localStorage.setItem('audioVolume', newVolume);
    };

    return (
        <div className="space-y-6">
            {/* Microphone Section */}
            <div>
                <label className="block text-[#e8eaed] text-sm font-medium mb-2">
                    Microphone
                </label>
                <select
                    value={selectedMic}
                    onChange={(e) => handleMicChange(e.target.value)}
                    className="w-full bg-[#202124] border border-[#5f6368] text-[#e8eaed] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1a73e8]"
                >
                    <option value="default">Default</option>
                    {devices.microphones.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                        </option>
                    ))}
                </select>

                {/* Audio Level Meter */}
                {localStream && (
                    <div className="mt-3">
                        <div className="text-[#9aa0a6] text-xs mb-1">Input level</div>
                        <AudioLevelMeter stream={localStream} />
                    </div>
                )}
            </div>

            {/* Speakers Section */}
            <div>
                <label className="block text-[#e8eaed] text-sm font-medium mb-2">
                    Speakers
                </label>
                <div className="flex gap-2">
                    <select
                        value={selectedSpeaker}
                        onChange={(e) => handleSpeakerChange(e.target.value)}
                        className="flex-1 bg-[#202124] border border-[#5f6368] text-[#e8eaed] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1a73e8]"
                    >
                        <option value="default">Default</option>
                        {devices.speakers.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Speaker ${device.deviceId.slice(0, 5)}`}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={testSpeakers}
                        disabled={testingAudio}
                        className="px-4 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {testingAudio ? 'Testing...' : 'Test'}
                    </button>
                </div>
            </div>

            {/* Volume Slider */}
            <div>
                <label className="block text-[#e8eaed] text-sm font-medium mb-2">
                    Volume
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-2 bg-[#5f6368] rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
                    />
                    <span className="text-[#e8eaed] text-sm w-12 text-right">{volume}%</span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#5f6368]" />

            {/* Audio Enhancements */}
            <div>
                <h3 className="text-[#e8eaed] text-base font-medium mb-4">Audio enhancements</h3>
                
                {/* Noise Suppression */}
                <label className="flex items-center justify-between py-3 cursor-pointer group">
                    <span className="text-[#e8eaed] text-sm">Noise suppression</span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={noiseSuppression}
                            onChange={(e) => {
                                setNoiseSuppression(e.target.checked);
                                localStorage.setItem('noiseSuppression', e.target.checked);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#5f6368] rounded-full peer peer-checked:bg-[#1a73e8] transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                </label>

                {/* Echo Cancellation */}
                <label className="flex items-center justify-between py-3 cursor-pointer group">
                    <span className="text-[#e8eaed] text-sm">Echo cancellation</span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={echoCancellation}
                            onChange={(e) => {
                                setEchoCancellation(e.target.checked);
                                localStorage.setItem('echoCancellation', e.target.checked);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#5f6368] rounded-full peer peer-checked:bg-[#1a73e8] transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                </label>
            </div>
        </div>
    );
};

export default AudioSettings;

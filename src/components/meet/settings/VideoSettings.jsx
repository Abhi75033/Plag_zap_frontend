import React, { useState, useEffect } from 'react';
import VideoPreview from './VideoPreview';

/**
 * Video Settings Tab
 * Camera, resolution, visual effects
 */
const VideoSettings = ({ localStream }) => {
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('default');
    const [resolution, setResolution] = useState('720p');
    const [backgroundBlur, setBackgroundBlur] = useState(false);
    const [autoFraming, setAutoFraming] = useState(false);

    // Load cameras
    useEffect(() => {
        loadCameras();
        
        navigator.mediaDevices.addEventListener('devicechange', loadCameras);
        return () => navigator.mediaDevices.removeEventListener('devicechange', loadCameras);
    }, []);

    // Load saved preferences
    useEffect(() => {
        const savedResolution = localStorage.getItem('videoResolution');
        const savedBlur = localStorage.getItem('backgroundBlur');
        const savedFraming = localStorage.getItem('autoFraming');

        if (savedResolution) setResolution(savedResolution);
        if (savedBlur) setBackgroundBlur(savedBlur === 'true');
        if (savedFraming) setAutoFraming(savedFraming === 'true');
    }, []);

    const loadCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            setCameras(devices.filter(d => d.kind === 'videoinput'));
        } catch (err) {
            console.error('Error loading cameras:', err);
        }
    };

    const handleCameraChange = (deviceId) => {
        setSelectedCamera(deviceId);
        localStorage.setItem('preferredCamera', deviceId);
        // TODO: Actually switch camera in useMediaDevices
    };

    const handleResolutionChange = (res) => {
        setResolution(res);
        localStorage.setItem('videoResolution', res);
    };

    return (
        <div className="space-y-6">
            {/* Camera Section */}
            <div>
                <label className="block text-[#e8eaed] text-sm font-medium mb-2">
                    Camera
                </label>
                <select
                    value={selectedCamera}
                    onChange={(e) => handleCameraChange(e.target.value)}
                    className="w-full bg-[#202124] border border-[#5f6368] text-[#e8eaed] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1a73e8]"
                >
                    <option value="default">Default</option>
                    {cameras.map(camera => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Live Preview */}
            <div>
                <div className="text-[#e8eaed] text-sm font-medium mb-2">Preview</div>
                <VideoPreview stream={localStream} />
            </div>

            {/* Divider */}
            <div className="border-t border-[#5f6368]" />

            {/* Resolution */}
            <div>
                <h3 className="text-[#e8eaed] text-base font-medium mb-3">Video quality</h3>
                
                <div className="space-y-2">
                    {[
                        { value: '360p', label: '360p (Data saver)', desc: 'Low quality, saves bandwidth' },
                        { value: '720p', label: '720p (Standard)', desc: 'Recommended for most users' },
                        { value: '1080p', label: '1080p (High quality)', desc: 'Best quality, requires good connection' }
                    ].map((option) => (
                        <label
                            key={option.value}
                            className="flex items-start gap-3 p-3 hover:bg-[#3c4043] rounded-lg cursor-pointer transition-colors"
                        >
                            <input
                                type="radio"
                                name="resolution"
                                value={option.value}
                                checked={resolution === option.value}
                                onChange={() => handleResolutionChange(option.value)}
                                className="mt-1 w-4 h-4 text-[#1a73e8] border-[#5f6368] focus:ring-[#1a73e8]"
                            />
                            <div className="flex-1">
                                <div className="text-[#e8eaed] text-sm font-medium">{option.label}</div>
                                <div className="text-[#9aa0a6] text-xs mt-0.5">{option.desc}</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#5f6368]" />

            {/* Visual Effects */}
            <div>
                <h3 className="text-[#e8eaed] text-base font-medium mb-4">Visual effects</h3>
                
                {/* Background Blur */}
                <label className="flex items-center justify-between py-3 cursor-pointer group">
                    <div>
                        <div className="text-[#e8eaed] text-sm">Background blur</div>
                        <div className="text-[#9aa0a6] text-xs mt-0.5">Blur your surroundings</div>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={backgroundBlur}
                            onChange={(e) => {
                                setBackgroundBlur(e.target.checked);
                                localStorage.setItem('backgroundBlur', e.target.checked);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#5f6368] rounded-full peer peer-checked:bg-[#1a73e8] transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                </label>

                {/* Auto Framing */}
                <label className="flex items-center justify-between py-3 cursor-pointer group">
                    <div>
                        <div className="text-[#e8eaed] text-sm">Auto-framing</div>
                        <div className="text-[#9aa0a6] text-xs mt-0.5">Keep yourself centered</div>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={autoFraming}
                            onChange={(e) => {
                                setAutoFraming(e.target.checked);
                                localStorage.setItem('autoFraming', e.target.checked);
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

export default VideoSettings;

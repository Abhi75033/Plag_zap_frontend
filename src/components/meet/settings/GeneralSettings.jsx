import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';

/**
 * General Settings Tab
 * Notifications, shortcuts, performance
 */
const GeneralSettings = () => {
    const [joinLeaveSound, setJoinLeaveSound] = useState(true);
    const [chatNotifications, setChatNotifications] = useState(true);
    const [reduceAnimations, setReduceAnimations] = useState(false);
    const [lowBandwidth, setLowBandwidth] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Load saved preferences
    useEffect(() => {
        const savedJoinLeave = localStorage.getItem('joinLeaveSound');
        const savedChatNot = localStorage.getItem('chatNotifications');
        const savedAnimations = localStorage.getItem('reduceAnimations');
        const savedBandwidth = localStorage.getItem('lowBandwidth');

        if (savedJoinLeave) setJoinLeaveSound(savedJoinLeave === 'true');
        if (savedChatNot) setChatNotifications(savedChatNot === 'true');
        if (savedAnimations) setReduceAnimations(savedAnimations === 'true');
        if (savedBandwidth) setLowBandwidth(savedBandwidth === 'true');
    }, []);

    const shortcuts = [
        { keys: 'Ctrl/⌘ + D', action: 'Toggle microphone' },
        { keys: 'Ctrl/⌘ + E', action: 'Toggle camera' },
        { keys: 'Ctrl/⌘ + Shift + E', action: 'Toggle screen share' },
        { keys: 'Ctrl/⌘ + Shift + C', action: 'Toggle chat' },
        { keys: 'Ctrl/⌘ + Shift + P', action: 'Toggle participants' },
        { keys: 'Ctrl/⌘ + Shift + H', action: 'Raise/lower hand' },
        { keys: 'Ctrl/⌘ + W', action: 'Leave meeting' }
    ];

    return (
        <div className="space-y-6">
            {/* Notifications */}
            <div>
                <h3 className="text-[#e8eaed] text-base font-medium mb-4">Notifications</h3>
                
                {/* Join/Leave Sounds */}
                <label className="flex items-center justify-between py-3 cursor-pointer">
                    <div>
                        <div className="text-[#e8eaed] text-sm">Join and leave sounds</div>
                        <div className="text-[#9aa0a6] text-xs mt-0.5">Play sound when people join or leave</div>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={joinLeaveSound}
                            onChange={(e) => {
                                setJoinLeaveSound(e.target.checked);
                                localStorage.setItem('joinLeaveSound', e.target.checked);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#5f6368] rounded-full peer peer-checked:bg-[#1a73e8] transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                </label>

                {/* Chat Notifications */}
                <label className="flex items-center justify-between py-3 cursor-pointer">
                    <div>
                        <div className="text-[#e8eaed] text-sm">Chat notifications</div>
                        <div className="text-[#9aa0a6] text-xs mt-0.5">Show alerts for new messages</div>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={chatNotifications}
                            onChange={(e) => {
                                setChatNotifications(e.target.checked);
                                localStorage.setItem('chatNotifications', e.target.checked);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#5f6368] rounded-full peer peer-checked:bg-[#1a73e8] transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                </label>
            </div>

            {/* Divider */}
            <div className="border-t border-[#5f6368]" />

            {/* Keyboard Shortcuts */}
            <div>
                <h3 className="text-[#e8eaed] text-base font-medium mb-3">Keyboard shortcuts</h3>
                
                <button
                    onClick={() => setShowShortcuts(!showShortcuts)}
                    className="flex items-center gap-2 text-[#1a73e8] hover:text-[#1557b0] transition-colors"
                >
                    <Keyboard className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {showShortcuts ? 'Hide shortcuts' : 'View shortcuts'}
                    </span>
                </button>

                {showShortcuts && (
                    <div className="mt-4 bg-[#202124] rounded-lg p-4 border border-[#5f6368]">
                        <div className="space-y-2">
                            {shortcuts.map((shortcut, index) => (
                                <div key={index} className="flex items-center justify-between py-2">
                                    <span className="text-[#e8eaed] text-sm">{shortcut.action}</span>
                                    <span className="text-[#9aa0a6] text-sm font-mono bg-[#303134] px-3 py-1 rounded">
                                        {shortcut.keys}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#5f6368]" />

            {/* Performance */}
            <div>
                <h3 className="text-[#e8eaed] text-base font-medium mb-4">Performance</h3>
                
                {/* Reduce Animations */}
                <label className="flex items-center justify-between py-3 cursor-pointer">
                    <div>
                        <div className="text-[#e8eaed] text-sm">Reduce animations</div>
                        <div className="text-[#9aa0a6] text-xs mt-0.5">For low-end devices</div>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={reduceAnimations}
                            onChange={(e) => {
                                setReduceAnimations(e.target.checked);
                                localStorage.setItem('reduceAnimations', e.target.checked);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#5f6368] rounded-full peer peer-checked:bg-[#1a73e8] transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                </label>

                {/* Low Bandwidth Mode */}
                <label className="flex items-center justify-between py-3 cursor-pointer">
                    <div>
                        <div className="text-[#e8eaed] text-sm">Low bandwidth mode</div>
                        <div className="text-[#9aa0a6] text-xs mt-0.5">Reduce video quality to save data</div>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={lowBandwidth}
                            onChange={(e) => {
                                setLowBandwidth(e.target.checked);
                                localStorage.setItem('lowBandwidth', e.target.checked);
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

export default GeneralSettings;

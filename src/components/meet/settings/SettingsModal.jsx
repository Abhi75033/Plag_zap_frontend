import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioSettings from './AudioSettings';
import VideoSettings from './VideoSettings';
import GeneralSettings from './GeneralSettings';

/**
 * Settings Modal - Google Meet Style
 * Three tabs: Audio, Video, General
 */
const SettingsModal = ({ isOpen, onClose, localStream }) => {
    const [activeTab, setActiveTab] = useState('audio');

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const tabs = [
        { id: 'audio', label: 'Audio' },
        { id: 'video', label: 'Video' },
        { id: 'general', label: 'General' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[rgba(32,33,36,0.85)] z-50 flex items-center justify-center"
                        onClick={onClose}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#303134] rounded-xl w-full max-w-[720px] h-[600px] flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#5f6368]">
                                <h2 className="text-[#e8eaed] text-xl font-semibold">Settings</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[#5f6368] rounded-full transition-colors"
                                    aria-label="Close settings"
                                >
                                    <X className="w-5 h-5 text-[#e8eaed]" />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Left Sidebar */}
                                <div className="w-[180px] border-r border-[#5f6368] bg-[#202124]">
                                    <div className="py-2">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full text-left px-6 py-3 text-sm transition-colors ${
                                                    activeTab === tab.id
                                                        ? 'bg-[#1a73e8] text-white font-medium'
                                                        : 'text-[#e8eaed] hover:bg-[#3c4043]'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {activeTab === 'audio' && <AudioSettings localStream={localStream} />}
                                    {activeTab === 'video' && <VideoSettings localStream={localStream} />}
                                    {activeTab === 'general' && <GeneralSettings />}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;

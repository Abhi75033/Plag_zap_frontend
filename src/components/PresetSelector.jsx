import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {  Loader2, Sparkles } from 'lucide-react';
import { getPresets, generateFromPreset } from '../services/api';
import toast from 'react-hot-toast';

const PresetSelector = ({ topic, onContentGenerated, onClose }) => {
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generatingPreset, setGeneratingPreset] = useState(null);

    useEffect(() => {
        loadPresets();
    }, []);

    const loadPresets = async () => {
        try {
            const { data } = await getPresets();
            setPresets(data.presets);
        } catch (error) {
            console.error('Failed to load presets:', error);
            toast.error('Failed to load presets');
        }
    };

    const handlePresetSelect = async (presetId) => {
        if (!topic || !topic.trim()) {
            toast.error('Please enter a topic first');
            return;
        }

        setGeneratingPreset(presetId);
        setLoading(true);

        try {
            const { data } = await generateFromPreset({ 
                presetId, 
                topic: topic.trim() 
            });
            
            onContentGenerated(data.content, data.preset);
            toast.success(`${data.preset.name} generated!`);
            if (onClose) onClose();
        } catch (error) {
            console.error('Preset generation error:', error);
            toast.error('Failed to generate content');
        } finally {
            setLoading(false);
            setGeneratingPreset(null);
        }
    };

    return (
        <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-md font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Quick Start Presets
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Choose a template for your academic writing</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {presets.map((preset) => (
                    <motion.button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset.id)}
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className={`
                            group relative bg-white/5 border border-white/10 rounded-lg p-3
                            hover:bg-white/10 hover:border-purple-500/50 transition-all
                            text-left disabled:opacity-50 disabled:cursor-not-allowed
                            ${generatingPreset === preset.id ? 'border-purple-500 bg-purple-500/10' : ''}
                        `}
                    >
                        {/* Icon */}
                        <div className="text-2xl mb-2">{preset.icon}</div>

                        {/* Title & Description */}
                        <h4 className="font-semibold text-white text-sm mb-1">{preset.name}</h4>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{preset.description}</p>

                        {/* Structure */}
                        <div className="text-xs text-purple-300 bg-black/30 rounded px-2 py-1 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                            {preset.structure}
                        </div>

                        {/* Loading Indicator */}
                        {generatingPreset === preset.id && (
                            <div className="absolute inset-0 bg-purple-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                            </div>
                        )}
                    </motion.button>
                ))}
            </div>

            {!topic && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-xs text-yellow-300 text-center">
                        ⚠️ Please enter a topic above before selecting a preset
                    </p>
                </div>
            )}
        </div>
    );
};

export default PresetSelector;

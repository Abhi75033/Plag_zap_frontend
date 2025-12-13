import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, Sparkles, BookOpen, Briefcase, Wand2, 
    Copy, Download, Loader2, AlertCircle, CheckCircle,
    ChevronDown, Settings, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateContent } from '../services/api';

const MODES = [
    { 
        id: 'blog', 
        label: 'Blog Writing', 
        icon: FileText,
        description: 'SEO-friendly, conversational blog posts',
        color: 'from-purple-600 to-pink-600'
    },
    { 
        id: 'research', 
        label: 'Research Writing', 
        icon: BookOpen,
        description: 'Formal, analytical research papers',
        color: 'from-blue-600 to-cyan-600'
    },
    { 
        id: 'academic', 
        label: 'Academic Writing', 
        icon: Sparkles,
        description: 'Scholarly essays and assignments',
        color: 'from-green-600 to-emerald-600'
    },
    { 
        id: 'professional', 
        label: 'Professional', 
        icon: Briefcase,
        description: 'Business reports and documents',
        color: 'from-orange-600 to-amber-600'
    }
];

const TONES = ['Neutral', 'Formal', 'Conversational', 'Analytical', 'Persuasive'];
const LENGTHS = ['Short (300-500)', 'Medium (500-1000)', 'Long (1000-2000)'];

const ContentWriter = () => {
    const [selectedMode, setSelectedMode] = useState(MODES[0]);
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState('Neutral');
    const [length, setLength] = useState('Medium (500-1000)');
    const [generatedContent, setGeneratedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        setGeneratedContent('');
        setFeedback(null);

        try {
            const { data } = await generateContent({
                mode: selectedMode.id,
                topic: topic.trim(),
                keywords: keywords.trim(),
                tone,
                length
            });

            setGeneratedContent(data.content);
            setFeedback({
                plagiarismRisk: data.plagiarismRisk || 5,
                aiDetectionRisk: data.aiDetectionRisk || 8,
                readability: data.readability || 85,
                toneMatch: data.toneMatch || 90
            });
            toast.success('Content generated successfully!');
        } catch (error) {
            console.error('Content generation error:', error);
            toast.error(error.response?.data?.error || 'Failed to generate content');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedContent);
        toast.success('Content copied to clipboard!');
    };

    const downloadDoc = () => {
        const blob = new Blob([generatedContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/\s+/g, '_')}.txt`;
        a.click();
        toast.success('Downloaded!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Wand2 className="w-6 h-6 text-purple-400" />
                                AI Content Writer
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Mode-based content generation with anti-AI detection
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Panel - Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Mode Selector */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                Writing Mode
                            </h3>
                            <div className="space-y-2">
                                {MODES.map((mode) => {
                                    const Icon = mode.icon;
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode)}
                                            className={`w-full p-4 rounded-xl transition-all text-left ${
                                                selectedMode.id === mode.id
                                                    ? `bg-gradient-to-r ${mode.color} shadow-lg`
                                                    : 'bg-white/5 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5" />
                                                <div>
                                                    <div className="font-semibold">{mode.label}</div>
                                                    <div className="text-xs text-gray-400">{mode.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                                    >
                                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Length</label>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                                    >
                                        {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Panel */}
                        {feedback && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                    Quality Metrics
                                </h3>
                                <div className="space-y-3">
                                    <MetricBar label="Plagiarism Risk" value={feedback.plagiarismRisk} max={100} color="green" invert />
                                    <MetricBar label="AI Detection Risk" value={feedback.aiDetectionRisk} max={100} color="blue" invert />
                                    <MetricBar label="Readability" value={feedback.readability} max={100} color="purple" />
                                    <MetricBar label="Tone Match" value={feedback.toneMatch} max={100} color="orange" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Input Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                Input
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Topic *</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Enter your topic..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Keywords (optional)</label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="AI, machine learning, technology..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic.trim()}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                        loading || !topic.trim()
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : `bg-gradient-to-r ${selectedMode.color} hover:shadow-lg`
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-5 h-5" />
                                            Generate Content
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Output Section */}
                        {generatedContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                        Generated Content
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={downloadDoc}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/20 border border-white/10 rounded-xl p-6 max-h-[600px] overflow-y-auto">
                                    <div className="prose prose-invert max-w-none">
                                        {generatedContent.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-4 leading-relaxed">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Metric Bar Component
const MetricBar = ({ label, value, max, color, invert }) => {
    const percentage = (value / max) * 100;
    const getColor = () => {
        if (invert) {
            if (value < 20) return 'bg-green-500';
            if (value < 50) return 'bg-yellow-500';
            return 'bg-red-500';
        }
        if (value > 80) return 'bg-green-500';
        if (value > 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="font-bold">{value}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ContentWriter;

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, Sparkles, BookOpen, Briefcase, Wand2, 
    Copy, Download, Loader2, AlertCircle, CheckCircle,
    ChevronDown, ChevronUp, Lightbulb, Target, Beaker,
    Zap, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    generateContent, 
    analyzeTopic, 
    generateTitles, 
    suggestAngles,
    buildResearch,
    refineContent 
} from '../services/api';

const MODES = [
    { id: 'blog', label: 'Blog Writing', icon: FileText, description: 'SEO-friendly, conversational blog posts', color: 'from-purple-600 to-pink-600' },
    { id: 'research', label: 'Research Writing', icon: BookOpen, description: 'Formal, analytical research papers', color: 'from-blue-600 to-cyan-600' },
    { id: 'academic', label: 'Academic Writing', icon: Sparkles, description: 'Scholarly essays and assignments', color: 'from-green-600 to-emerald-600' },
    { id: 'professional', label: 'Professional', icon: Briefcase, description: 'Business reports and documents', color: 'from-orange-600 to-amber-600' }
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

    // Intelligence states
    const [intelligence, setIntelligence] = useState({
        analysis: null,
        titles: [],
        angles: null,
        research: null
    });
    const [intelligenceLoading, setIntelligenceLoading] = useState({
        analysis: false,
        titles: false,
        angles: false,
        research: false
    });
    const [expandedSections, setExpandedSections] = useState({
        preWriting: true,
        research: false,
        refinement: false
    });

    // Auto-analyze topic (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (topic.trim().length > 10) {
                handleAnalyzeTopic();
            } else {
                setIntelligence(prev => ({ ...prev, analysis: null, titles: [], angles: null }));
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [topic, selectedMode.id]);

    const handleAnalyzeTopic = async () => {
        setIntelligenceLoading(prev => ({ ...prev, analysis: true, titles: true, angles: true }));
        
        try {
            // Run all pre-writing intelligence in parallel
            const [analysisRes, titlesRes, anglesRes] = await Promise.all([
                analyzeTopic({ topic: topic.trim(), mode: selectedMode.id }),
                generateTitles({ topic: topic.trim(), mode: selectedMode.id }),
                suggestAngles({ topic: topic.trim(), mode: selectedMode.id })
            ]);

            setIntelligence(prev => ({
                ...prev,
                analysis: analysisRes.data,
                titles: titlesRes.data.titles || [],
                angles: anglesRes.data
            }));
        } catch (error) {
            console.error('Intelligence error:', error);
        } finally {
            setIntelligenceLoading({ analysis: false, titles: false, angles: false, research: false });
        }
    };

    const handleBuildResearch = async () => {
        if (selectedMode.id !== 'research' && selectedMode.id !== 'academic') return;
        
        setIntelligenceLoading(prev => ({ ...prev, research: true }));
        try {
            const { data } = await buildResearch({ topic: topic.trim(), mode: selectedMode.id });
            setIntelligence(prev => ({ ...prev, research: data }));
            setExpandedSections(prev => ({ ...prev, research: true }));
        } catch (error) {
            console.error('Research builder error:', error);
            toast.error('Failed to build research framework');
        } finally {
            setIntelligenceLoading(prev => ({ ...prev, research: false }));
        }
    };

    const handleRefineContent = async (action) => {
        if (!generatedContent) return;
        
        setLoading(true);
        try {
            const { data } = await refineContent({
                content: generatedContent,
                action,
                mode: selectedMode.id
            });
            setGeneratedContent(data.refinedContent);
            toast.success('Content refined!');
        } catch (error) {
            console.error('Refinement error:', error);
            toast.error('Failed to refine content');
        } finally {
            setLoading(false);
        }
    };

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

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pb-20 md:pb-0">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                                <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                                AI Content Writer
                            </h1>
                            <p className="text-xs md:text-sm text-gray-400 mt-1">
                                Intelligent writing assistant
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
                <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Left Panel - Controls */}
                    <div className="lg:col-span-1 space-y-4 md:space-y-6">
                        {/* Mode Selector - Horizontal on mobile, vertical on desktop */}
                        <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                            <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                                Writing Mode
                            </h3>
                            {/* Mobile: Horizontal scroll */}
                            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                                {MODES.map((mode) => {
                                    const Icon = mode.icon;
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode)}
                                            className={`flex-shrink-0 p-3 rounded-lg transition-all ${
                                                selectedMode.id === mode.id
                                                    ? `bg-gradient-to-r ${mode.color} shadow-lg`
                                                    : 'bg-white/5 active:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center gap-1 min-w-[80px]">
                                                <Icon className="w-5 h-5" />
                                                <div className="text-xs font-semibold text-center">{mode.label.split(' ')[0]}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Desktop: Vertical */}
                            <div className="hidden lg:block space-y-2">
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
                        <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                            <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                                Settings
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                                <div>
                                    <label className="text-xs md:text-sm text-gray-400 mb-2 block">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
                                    >
                                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm text-gray-400 mb-2 block">Length</label>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
                                    >
                                        {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Panel */}
                        {feedback && (
                            <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                                <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                                    Quality Metrics
                                </h3>
                                <div className="space-y-3">
                                    <MetricBar label="Plagiarism Risk" value={feedback.plagiarismRisk} max={100} invert />
                                    <MetricBar label="AI Detection Risk" value={feedback.aiDetectionRisk} max={100} invert />
                                    <MetricBar label="Readability" value={feedback.readability} max={100} />
                                    <MetricBar label="Tone Match" value={feedback.toneMatch} max={100} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Editor */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        {/* Input Section */}
                        <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                            <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                                Input
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="text-xs md:text-sm text-gray-400 mb-2 block">Topic *</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Enter your topic..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Topic Intelligence - Auto-appears */}
                                <AnimatePresence>
                                    {intelligence.analysis && (
                                        <TopicInsight 
                                            analysis={intelligence.analysis}
                                            loading={intelligenceLoading.analysis}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Suggested Titles */}
                                <AnimatePresence>
                                    {intelligence.titles.length > 0 && (
                                        <SuggestedTitles 
                                            titles={intelligence.titles}
                                            onSelect={setTopic}
                                            loading={intelligenceLoading.titles}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Content Angles */}
                                <AnimatePresence>
                                    {intelligence.angles && (
                                        <AngleSuggestions 
                                            angles={intelligence.angles}
                                            loading={intelligenceLoading.angles}
                                        />
                                    )}
                                </AnimatePresence>

                                <div>
                                    <label className="text-xs md:text-sm text-gray-400 mb-2 block">Keywords (optional)</label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="AI, machine learning, technology..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Research Builder (Research/Academic only) */}
                                {(selectedMode.id === 'research' || selectedMode.id === 'academic') && topic.trim() && (
                                    <ResearchBuilder
                                        topic={topic}
                                        mode={selectedMode.id}
                                        research={intelligence.research}
                                        loading={intelligenceLoading.research}
                                        onBuild={handleBuildResearch}
                                        expanded={expandedSections.research}
                                        onToggle={() => toggleSection('research')}
                                    />
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic.trim()}
                                    className={`w-full py-3 md:py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
                                        loading || !topic.trim()
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : `bg-gradient-to-r ${selectedMode.color} hover:shadow-lg active:scale-95`
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

                        {/* Refinement Actions */}
                        {generatedContent && (
                            <RefinementActions 
                                onRefine={handleRefineContent}
                                loading={loading}
                                mode={selectedMode.id}
                            />
                        )}

                        {/* Output Section */}
                        {generatedContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-3 md:mb-4">
                                    <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">
                                        Generated Content
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 bg-white/10 active:bg-white/20 rounded-lg transition-colors"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={downloadDoc}
                                            className="p-2 bg-white/10 active:bg-white/20 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/20 border border-white/10 rounded-xl p-4 md:p-6 max-h-[400px] md:max-h-[600px] overflow-y-auto">
                                    <div className="prose prose-invert max-w-none text-sm md:text-base">
                                        {generatedContent.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-3 md:mb-4 leading-relaxed">
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

// Sub-Components
const TopicInsight = ({ analysis, loading }) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4"
    >
        <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5" />
            <div className="flex-1">
                <h4 className="text-sm font-semibold text-purple-300 mb-2">Topic Insight</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-400">Domain:</span>
                        <span className="ml-2 text-white">{analysis.domain}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Intent:</span>
                        <span className="ml-2 text-white">{analysis.intent}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Complexity:</span>
                        <span className="ml-2 text-white">{analysis.complexity}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Best Mode:</span>
                        <span className="ml-2 text-white">{analysis.recommendedMode}</span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const SuggestedTitles = ({ titles, onSelect, loading }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold">Suggested Titles ({titles.length})</span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="border-t border-white/10"
                    >
                        <div className="p-4 space-y-2">
                            {titles.map((title, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelect(title);
                                        setExpanded(false);
                                        toast.success('Title applied!');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                                >
                                    {title}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const AngleSuggestions = ({ angles, loading }) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
    >
        <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
            <div className="flex-1 space-y-2 text-sm">
                <div>
                    <span className="text-green-300 font-semibold">Best Angle:</span>
                    <p className="text-gray-300 mt-1">{angles.angle}</p>
                </div>
                <div>
                    <span className="text-green-300 font-semibold">Focus On:</span>
                    <p className="text-gray-300 mt-1">{angles.focus}</p>
                </div>
                <div>
                    <span className="text-green-300 font-semibold">Avoid:</span>
                    <p className="text-gray-300 mt-1">{angles.avoid}</p>
                </div>
            </div>
        </div>
    </motion.div>
);

const ResearchBuilder = ({ topic, mode, research, loading, onBuild, expanded, onToggle }) => (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold">Research Framework</span>
            </div>
            <div className="flex gap-2">
                {!research && (
                    <button
                        onClick={onBuild}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-xs font-semibold transition-colors"
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Build'}
                    </button>
                )}
                {research && (
                    <button onClick={onToggle}>
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
        <AnimatePresence>
            {expanded && research && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-blue-500/20 p-4 space-y-4 text-sm max-h-96 overflow-y-auto"
                >
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Research Gap</h4>
                        <div className="space-y-1 text-gray-300">
                            <p><strong>Existing Focus:</strong> {research.researchGap.existingFocus}</p>
                            <p><strong>Under-Explored:</strong> {research.researchGap.underExplored}</p>
                            <p><strong>Your Fit:</strong> {research.researchGap.yourFit}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Problem Statement</h4>
                        <p className="text-gray-300">{research.problemStatement}</p>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Objectives</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {research.objectives.map((obj, idx) => <li key={idx}>{obj}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Research Questions</h4>
                        <p className="text-gray-300 mb-2"><strong>Primary:</strong> {research.researchQuestions.primary}</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {research.researchQuestions.secondary.map((q, idx) => <li key={idx}>{q}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Methodology</h4>
                        <div className="space-y-1 text-gray-300">
                            <p><strong>Type:</strong> {research.methodology.type}</p>
                            <p><strong>Datasets:</strong> {research.methodology.datasets}</p>
                            <p><strong>Metrics:</strong> {research.methodology.metrics}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const RefinementActions = ({ onRefine, loading, mode }) => {
    const actions = [
        { id: 'reduceAI', label: 'Reduce AI Risk', icon: Zap, color: 'purple' },
        { id: 'improveTone', label: 'Improve Tone', icon: TrendingUp, color: 'blue' },
        { id: 'improveReadability', label: 'Improve Readability', icon: CheckCircle, color: 'green' },
        ...(mode === 'research' || mode === 'academic' 
            ? [{ id: 'makeAcademic', label: 'More Academic', icon: Sparkles, color: 'cyan' }]
            : [{ id: 'makeConversational', label: 'More Casual', icon: FileText, color: 'orange' }]
        )
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
            <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                Smart Refinements
            </h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
                {actions.map(action => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.id}
                            onClick={() => onRefine(action.id)}
                            disabled={loading}
                            className="px-3 md:px-4 py-2.5 md:py-3 bg-white/5 active:bg-white/10 md:hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs md:text-sm font-medium disabled:opacity-50"
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const MetricBar = ({ label, value, max, invert }) => {
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

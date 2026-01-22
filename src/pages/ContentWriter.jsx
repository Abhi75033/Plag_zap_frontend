import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, Sparkles, BookOpen, Briefcase, Wand2, 
    Copy, Download, Loader2, AlertCircle, CheckCircle,
    ChevronDown, ChevronUp, Lightbulb, Target, Beaker,
    Zap, TrendingUp, ArrowRight, Award, Library, Globe, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    generateContent, 
    analyzeTopic, 
    generateTitles, 
    suggestAngles,
    buildResearch,
    refineContent,
    saveWriterToHistory,
    getSupervisorFeedback
} from '../services/api';
import BeforeAfterComparison from '../components/BeforeAfterComparison';
import SupervisorFeedback from '../components/SupervisorFeedback';
import PresetSelector from '../components/PresetSelector';
import rewardsAPI from '../services/rewards';
import LoginPromptModal from '../components/ui/LoginPromptModal';
import { useAppContext } from '../context/AppContext';

const MODES = [
    { id: 'blog', label: 'Blog Writing', icon: FileText, description: 'SEO-friendly, conversational blog posts', color: 'from-purple-600 to-pink-600' },
    { id: 'research', label: 'Research Writing', icon: BookOpen, description: 'Formal, analytical research papers', color: 'from-blue-600 to-cyan-600' },
    { id: 'academic', label: 'Academic Writing', icon: Sparkles, description: 'Scholarly essays and assignments', color: 'from-green-600 to-emerald-600' },
    { id: 'professional', label: 'Professional', icon: Briefcase, description: 'Business reports and documents', color: 'from-orange-600 to-amber-600' },
    { id: 'cover_letter', label: 'Cover Letter', icon: Target, description: 'ATS-optimized job application letters', color: 'from-pink-600 to-rose-600' },
    { id: 'journal_finder', label: 'Journal Finder', icon: Library, description: 'Find reputable journals for your research', color: 'from-cyan-600 to-blue-600' }
];

const TONES = ['Neutral', 'Formal', 'Conversational', 'Analytical', 'Persuasive'];
const LENGTHS = ['Short (300-500)', 'Medium (500-1000)', 'Long (1000-2000)'];

const ContentWriter = () => {
    const [selectedMode, setSelectedMode] = useState(MODES[0]);
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    // Cover Letter specific state
    const [jobRole, setJobRole] = useState('');
    const [company, setCompany] = useState('');
    const [experience, setExperience] = useState('');
    const [skills, setSkills] = useState('');
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
    const [appliedRefinements, setAppliedRefinements] = useState([]);
    
    // Before/After Comparison state
    const [showComparison, setShowComparison] = useState(false);
    const [comparisonData, setComparisonData] = useState({
        original: '',
        refined: '',
        metrics: null
    });
    
    // Supervisor Feedback state
    const [showSupervisor, setShowSupervisor] = useState(false);
    const [supervisorFeedback, setSupervisorFeedback] = useState(null);
    const [supervisorLoading, setSupervisorLoading] = useState(false);
    
    // Presets state
    const [showPresets, setShowPresets] = useState(false);
    
    // Freemium tracking for anonymous users
    const { user } = useAppContext();
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Auto-analyze topic (debounced)
    useEffect(() => {
        console.log('[INTELLIGENCE] useEffect fired - topic:', topic, 'length:', topic.trim().length);
        const timer = setTimeout(() => {
            if (topic.trim().length > 10) {
                console.log('[INTELLIGENCE] Triggering handleAnalyzeTopic');
                handleAnalyzeTopic();
            } else {
                console.log('[INTELLIGENCE] Topic too short, clearing intelligence');
                setIntelligence(prev => ({ ...prev, analysis: null, titles: [], angles: null }));
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [topic, selectedMode.id]);

    // Reset fields when mode changes
    useEffect(() => {
        setTopic('');
        setKeywords('');
        setJobRole('');
        setCompany('');
        setExperience('');
        setSkills('');
    }, [selectedMode]);

    const handleAnalyzeTopic = async () => {
        console.log('[INTELLIGENCE] handleAnalyzeTopic called');
        setIntelligenceLoading(prev => ({ ...prev, analysis: true, titles: true, angles: true }));
        
        try {
            console.log('[INTELLIGENCE] Calling APIs...');
            // Run all pre-writing intelligence in parallel
            const [analysisRes, titlesRes, anglesRes] = await Promise.all([
                analyzeTopic({ topic: topic.trim(), mode: selectedMode.id }),
                generateTitles({ topic: topic.trim(), mode: selectedMode.id }),
                suggestAngles({ topic: topic.trim(), mode: selectedMode.id })
            ]);

            console.log('[INTELLIGENCE] API responses:', {
                analysis: analysisRes.data,
                titles: titlesRes.data.titles,
                angles: anglesRes.data
            });

            setIntelligence(prev => ({
                ...prev,
                analysis: analysisRes.data,
                titles: titlesRes.data.titles || [],
                angles: anglesRes.data
            }));
            console.log('[INTELLIGENCE] State updated successfully');
        } catch (error) {
            console.error('[INTELLIGENCE] Error:', error);
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
        
        // Freemium check: Block ALL refinements for anonymous users
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        
        // Save the original content before refinement
        const originalContent = generatedContent;
        const originalAiRisk = feedback?. aiDetectionRisk || 0;
        
        setLoading(true);
        try {
            const { data } = await refineContent({
                content: generatedContent,
                action,
                mode: selectedMode.id
            });
            setGeneratedContent(data.refinedContent);
            
            // Track the refinement
            const actionLabels = {
                'reduceAI': 'Reduce AI',
                'improveTone': 'Improve Tone',
                'improveReadability': 'Improve Readability',
                'makeAcademic': 'Make Academic',
                'makeConversational': 'Make Conversational'
            };
            const refinementLabel = actionLabels[action] || action;
            const updatedRefinements = [...appliedRefinements, refinementLabel];
            setAppliedRefinements(updatedRefinements);
            
            // Set AI feedback for refined content
            if (data.aiDetectionRisk !== undefined) {
                setFeedback({
                    ...feedback,
                    aiDetectionRisk: data.aiDetectionRisk
                });
            }
            
            // Update comparison data
            setComparisonData({
                original: originalContent,
                refined: data.refinedContent,
                metrics: {
                    aiRiskBefore: originalAiRisk,
                    aiRiskAfter: data.aiDetectionRisk || 0,
                    refinements: updatedRefinements
                }
            });
            
            toast.success('Content refined!');
            
            // Save refined version to history
            try {
                await saveWriterToHistory({
                    originalText: data.refinedContent,
                    mode: selectedMode.id,
                    refinements: updatedRefinements,
                    aiRiskAfter: feedback?.aiDetectionRisk || null
                });
            } catch (historyError) {
                console.error('Failed to save to history:', historyError);
            }
        } catch (error) {
            console.error('Refinement error:', error);
            toast.error('Failed to refine content');
        } finally {
            setLoading(false);
        }
    };

    const handleGetSupervisorFeedback = async () => {
        if (!generatedContent) return;
        
        setSupervisorLoading(true);
        try {
            const { data } = await getSupervisorFeedback({ text: generatedContent });
            setSupervisorFeedback(data.feedback);
            setShowSupervisor(true);
            toast.success('Supervisor feedback ready!');
        } catch (error) {
            console.error('Supervisor feedback error:', error);
            toast.error('Failed to get supervisor feedback');
        } finally {
            setSupervisorLoading(false);
        }
    };

    const handlePresetContent = (content, preset) => {
        setGeneratedContent(content);
        setShowPresets(false);
        toast.success(`${preset.name} generated!`);
    };

    const handleGenerate = async () => {
        // Validation based on mode
        if (selectedMode.id === 'cover_letter') {
            if (!jobRole.trim() || !company.trim()) {
                toast.error('Please enter Job Role and Company');
                return;
            }
        } else if (!topic.trim()) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        setGeneratedContent('');
        setFeedback(null);
        setAppliedRefinements([]); // Reset refinements for new content

        try {
            const { data } = await generateContent({
                mode: selectedMode.id,
                topic: selectedMode.id === 'cover_letter' ? `${jobRole} at ${company}` : topic.trim(),
                keywords: keywords.trim(),
                // Pass extra fields for cover letter
                jobRole: jobRole.trim(),
                company: company.trim(),
                experience: experience.trim(),
                skills: skills.trim(),
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
            
            // Save to history
            try {
                await saveWriterToHistory({
                    originalText: data.content,
                    mode: selectedMode.id,
                    aiRiskBefore: data.aiDetectionRisk || null
                });
            } catch (historyError) {
                console.error('Failed to save to history:', historyError);
                // Don't show error to user, history save is secondary
            }
            
            // Track activity for rewards system (non-blocking)
            try {
                await rewardsAPI.trackActivity('generate');
            } catch (error) {
                console.warn('Failed to track activity:', error);
            }
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
        <div className="min-h-screen relative text-white pb-20 md:pb-0 pt-16">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-black overflow-hidden">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
                
                {/* Animated gradient orbs */}
                <div className="absolute top-0 -left-48 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-48 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-48 left-1/2 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
                }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
            {/* Header */}
            <div className="border-b border-[var(--border)] bg-black/40 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                                <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                                AI Content Writer
                            </h1>
                            <p className="text-xs md:text-sm text-[var(--muted-foreground)] mt-1">
                                Intelligent writing assistant
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
                {/* Mobile-First Layout */}
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8">
                    
                    {/* MOBILE: Input Section First - Desktop: Right Panel */}
                    <div className="lg:hidden space-y-4">
                        {/* Mode Selector - Mobile */}
                        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                                Writing Mode
                            </h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                                {MODES.map((mode) => {
                                    const Icon = mode.icon;
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode)}
                                            className={`flex-shrink-0 p-3 rounded-lg transition-all ${
                                                selectedMode.id === mode.id
                                                    ? `bg-gradient-to-r ${mode.color} shadow-lg`
                                                    : 'bg-[var(--accent)] active:bg-[var(--secondary)]'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center gap-1 min-w-[70px]">
                                                <Icon className="w-5 h-5" />
                                                <div className="text-[10px] font-semibold text-center leading-tight">{mode.label.split(' ')[0]}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Settings - Mobile */}
                        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                                Settings
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-2.5 py-2 text-sm appearance-none"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%239CA3AF\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                                    >
                                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Length</label>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-2.5 py-2 text-xs appearance-none truncate"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%239CA3AF\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                                    >
                                        {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                         {/* Quality Metrics - Mobile */}
                        {feedback && (
                            <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-4 backdrop-blur-sm">
                                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
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

                        {/* Input Section */}
                        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                                Input
                            </h3>
                            <div className="space-y-3">
                                {/* Quick Start Presets Button */}
                                <button
                                    onClick={() => setShowPresets(!showPresets)}
                                    className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                        {showPresets ? 'Hide' : 'Quick Start Presets'}
                                    </span>
                                </button>

                                {/* Preset Selector */}
                                <AnimatePresence>
                                    {showPresets && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                        >
                                            <PresetSelector
                                                topic={topic}
                                                onContentGenerated={handlePresetContent}
                                                onClose={() => setShowPresets(false)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {selectedMode.id === 'cover_letter' ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">Job Role *</label>
                                            <input
                                                type="text"
                                                value={jobRole}
                                                onChange={(e) => setJobRole(e.target.value)}
                                                placeholder="e.g. Senior React Developer"
                                                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">Company Name *</label>
                                            <input
                                                type="text"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                placeholder="e.g. Google"
                                                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">Years of Experience</label>
                                            <input
                                                type="text"
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                                placeholder="e.g. 5 years"
                                                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">Key Skills</label>
                                            <input
                                                type="text"
                                                value={skills}
                                                onChange={(e) => setSkills(e.target.value)}
                                                placeholder="e.g. React, Node.js, Team Leadership"
                                                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>

                                        <div>
                                            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                                                {selectedMode.id === 'journal_finder' ? 'Research Topic *' : 'Topic *'}
                                            </label>
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder={selectedMode.id === 'journal_finder' ? "e.g. AI in Healthcare" : "Enter your topic..."}
                                                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
                                            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                                                {selectedMode.id === 'journal_finder' ? 'Niche / Specific Areas (optional)' : 'Keywords (optional)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={keywords}
                                                onChange={(e) => setKeywords(e.target.value)}
                                                placeholder="AI, machine learning..."
                                                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
                                    </>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || (selectedMode.id === 'cover_letter' ? (!jobRole.trim() || !company.trim()) : !topic.trim())}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                                        loading || (selectedMode.id === 'cover_letter' ? (!jobRole.trim() || !company.trim()) : !topic.trim())
                                            ? 'bg-gray-700 text-[var(--muted-foreground)] cursor-not-allowed'
                                            : `bg-gradient-to-r ${selectedMode.color} active:scale-95`
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

                        {/* Refinement Actions - Mobile */}
                        {generatedContent && (
                            <RefinementActions 
                                onRefine={handleRefineContent}
                                loading={loading}
                                mode={selectedMode.id}
                            />
                        )}

                        {/* Output Section - Mobile */}
                        {generatedContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-4 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                                        Generated Content
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 bg-[var(--secondary)] active:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={downloadDoc}
                                            className="p-2 bg-[var(--secondary)] active:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        {comparisonData.original && comparisonData.refined && (
                                            <button
                                                onClick={() => setShowComparison(true)}
                                                className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all flex items-center gap-1 px-3"
                                                title="View Before vs After"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Compare</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={handleGetSupervisorFeedback}
                                            disabled={supervisorLoading}
                                            className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all flex items-center gap-1 px-3 disabled:opacity-50"
                                            title="Get Supervisor Feedback"
                                        >
                                            <Award className="w-4 h-4" />
                                            <span className="text-xs font-semibold">
                                                {supervisorLoading ? 'Loading...' : 'Supervisor'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/20 border border-[var(--border)] rounded-xl p-4 max-h-[400px] overflow-y-auto">
                                    <div className="prose prose-invert max-w-none text-sm">
                                        {generatedContent.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-3 leading-relaxed">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Left Panel - Controls (Hidden on Mobile, Visible on Desktop) */}
                    <div className="hidden lg:block lg:col-span-1 space-y-4 md:space-y-6">
                        {/* Mode Selector */}
                        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                            <h3 className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 md:mb-4">
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
                                                    : 'bg-[var(--accent)] active:bg-[var(--secondary)]'
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
                                                    : 'bg-[var(--accent)] hover:bg-[var(--secondary)]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5" />
                                                <div>
                                                    <div className="font-semibold">{mode.label}</div>
                                                    <div className="text-xs text-[var(--muted-foreground)]">{mode.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                            <h3 className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 md:mb-4">
                                Settings
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                                <div>
                                    <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
                                    >
                                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">Length</label>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
                                    >
                                        {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Panel */}
                        {feedback && (
                            <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                                <h3 className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 md:mb-4">
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

                    {/* Right Panel - Editor (Hidden on Mobile, Visible on Desktop) */}
                    <div className="hidden lg:block lg:col-span-2 space-y-4 md:space-y-6">
                        {/* Input Section */}
                        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                            <h3 className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 md:mb-4">
                                Input
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                                {/* Quick Start Presets Button - Desktop */}
                                <button
                                    onClick={() => setShowPresets(!showPresets)}
                                    className="w-full py-2.5 md:py-3 px-4 md:px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                                >
                                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-sm md:text-base font-semibold">
                                        {showPresets ? 'Hide' : 'Quick Start Presets'}
                                    </span>
                                </button>

                                {/* Preset Selector - Desktop */}
                                <AnimatePresence>
                                    {showPresets && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                        >
                                            <PresetSelector
                                                topic={topic}
                                                onContentGenerated={handlePresetContent}
                                                onClose={() => setShowPresets(false)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {selectedMode.id === 'cover_letter' ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">Job Role *</label>
                                                <input
                                                    type="text"
                                                    value={jobRole}
                                                    onChange={(e) => setJobRole(e.target.value)}
                                                    placeholder="e.g. Senior React Developer"
                                                    className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">Company Name *</label>
                                                <input
                                                    type="text"
                                                    value={company}
                                                    onChange={(e) => setCompany(e.target.value)}
                                                    placeholder="e.g. Google"
                                                    className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">Years of Experience</label>
                                            <input
                                                type="text"
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                                placeholder="e.g. 5 years"
                                                className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">Key Skills</label>
                                            <input
                                                type="text"
                                                value={skills}
                                                onChange={(e) => setSkills(e.target.value)}
                                                placeholder="e.g. React, Node.js, Team Leadership"
                                                className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">
                                                {selectedMode.id === 'journal_finder' ? 'Research Topic *' : 'Topic *'}
                                            </label>
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder={selectedMode.id === 'journal_finder' ? "e.g. AI in Healthcare" : "Enter your topic..."}
                                                className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
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
                                            <label className="text-xs md:text-sm text-[var(--muted-foreground)] mb-2 block">
                                                {selectedMode.id === 'journal_finder' ? 'Niche / Specific Areas (optional)' : 'Keywords (optional)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={keywords}
                                                onChange={(e) => setKeywords(e.target.value)}
                                                placeholder="AI, machine learning, technology..."
                                                className="w-full bg-black/20 border border-[var(--border)] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </>
                                )}

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
                                    disabled={loading || (selectedMode.id === 'cover_letter' ? (!jobRole.trim() || !company.trim()) : !topic.trim())}
                                    className={`w-full py-3 md:py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
                                        loading || (selectedMode.id === 'cover_letter' ? (!jobRole.trim() || !company.trim()) : !topic.trim())
                                            ? 'bg-gray-700 text-[var(--muted-foreground)] cursor-not-allowed'
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
                        {generatedContent && selectedMode.id !== 'journal_finder' && (
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
                                className="bg-[var(--accent)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-3 md:mb-4">
                                    <h3 className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                                        Generated Content
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 bg-[var(--secondary)] active:bg-white/20 rounded-lg transition-colors"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={downloadDoc}
                                            className="p-2 bg-[var(--secondary)] active:bg-white/20 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        {selectedMode.id !== 'journal_finder' && comparisonData.original && comparisonData.refined && (
                                            <button
                                                onClick={() => setShowComparison(true)}
                                                className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all flex items-center gap-1 px-3"
                                                title="View Before vs After"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Compare</span>
                                            </button>
                                        )}
                                        {selectedMode.id !== 'journal_finder' && (
                                            <button
                                                onClick={handleGetSupervisorFeedback}
                                                disabled={supervisorLoading}
                                                className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all flex items-center gap-1 px-3 disabled:opacity-50"
                                                title="Get Supervisor Feedback"
                                            >
                                                <Award className="w-4 h-4" />
                                                <span className="text-xs font-semibold">
                                                    {supervisorLoading ? 'Loading...' : 'Supervisor'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-black/20 border border-[var(--border)] rounded-xl p-4 md:p-6 max-h-[400px] md:max-h-[600px] overflow-y-auto">
                                    {selectedMode.id === 'journal_finder' ? (
                                        <JournalList content={generatedContent} />
                                    ) : (
                                        <div className="prose prose-invert max-w-none text-sm md:text-base">
                                            {generatedContent.split('\n').map((paragraph, idx) => (
                                                <p key={idx} className="mb-3 md:mb-4 leading-relaxed">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            </div>

            {/* LoginPromp tModal for Anonymous Users */}
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                feature="writer"
            />

            {/* Before/After Comparison Modal */}
            <AnimatePresence>
                {showComparison && (
                    <BeforeAfterComparison
                        original={comparisonData.original}
                        refined={comparisonData.refined}
                        metrics={comparisonData.metrics}
                        onClose={() => setShowComparison(false)}
                    />
                )}
            </AnimatePresence>

            {/* Supervisor Feedback Modal */}
            <AnimatePresence>
                {showSupervisor && supervisorFeedback && (
                    <SupervisorFeedback
                        feedback={supervisorFeedback}
                        onClose={() => setShowSupervisor(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-Components
const TopicInsight = ({ analysis, loading }) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-3 md:p-4"
    >
        <div className="flex items-start gap-2 md:gap-3">
            <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <h4 className="text-xs md:text-sm font-semibold text-purple-300 mb-2">Topic Insight</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[var(--muted-foreground)] flex-shrink-0">Domain:</span>
                        <span className="text-white font-medium truncate">{analysis.domain}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[var(--muted-foreground)] flex-shrink-0">Intent:</span>
                        <span className="text-white font-medium truncate">{analysis.intent}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[var(--muted-foreground)] flex-shrink-0">Complexity:</span>
                        <span className="text-white font-medium truncate">{analysis.complexity}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[var(--muted-foreground)] flex-shrink-0">Best Mode:</span>
                        <span className="text-white font-medium truncate">{analysis.recommendedMode}</span>
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
            className="bg-[var(--accent)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between active:bg-[var(--accent)] md:hover:bg-[var(--accent)] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-semibold">Suggested Titles ({titles.length})</span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
            </button>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="border-t border-[var(--border)]"
                    >
                        <div className="p-3 md:p-4 space-y-2">
                            {titles.map((title, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelect(title);
                                        setExpanded(false);
                                        toast.success('Title applied!');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg bg-[var(--accent)] active:bg-[var(--secondary)] md:hover:bg-[var(--secondary)] transition-colors text-xs md:text-sm leading-relaxed break-words"
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
        className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 md:p-4"
    >
        <div className="flex items-start gap-2 md:gap-3">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2 text-xs md:text-sm min-w-0">
                <div>
                    <span className="text-green-300 font-semibold">Best Angle:</span>
                    <p className="text-[var(--muted-foreground)] mt-1 leading-relaxed break-words">{angles.angle}</p>
                </div>
                <div>
                    <span className="text-green-300 font-semibold">Focus On:</span>
                    <p className="text-[var(--muted-foreground)] mt-1 leading-relaxed break-words">{angles.focus}</p>
                </div>
                <div>
                    <span className="text-green-300 font-semibold">Avoid:</span>
                    <p className="text-[var(--muted-foreground)] mt-1 leading-relaxed break-words">{angles.avoid}</p>
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
                        <div className="space-y-1 text-[var(--muted-foreground)]">
                            <p><strong>Existing Focus:</strong> {research.researchGap.existingFocus}</p>
                            <p><strong>Under-Explored:</strong> {research.researchGap.underExplored}</p>
                            <p><strong>Your Fit:</strong> {research.researchGap.yourFit}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Problem Statement</h4>
                        <p className="text-[var(--muted-foreground)]">{research.problemStatement}</p>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Objectives</h4>
                        <ul className="list-disc list-inside text-[var(--muted-foreground)] space-y-1">
                            {research.objectives.map((obj, idx) => <li key={idx}>{obj}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Research Questions</h4>
                        <p className="text-[var(--muted-foreground)] mb-2"><strong>Primary:</strong> {research.researchQuestions.primary}</p>
                        <ul className="list-disc list-inside text-[var(--muted-foreground)] space-y-1">
                            {research.researchQuestions.secondary.map((q, idx) => <li key={idx}>{q}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Methodology</h4>
                        <div className="space-y-1 text-[var(--muted-foreground)]">
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
        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
            <h3 className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 md:mb-4">
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
                            className="px-3 md:px-4 py-2.5 md:py-3 bg-[var(--accent)] active:bg-[var(--secondary)] md:hover:bg-[var(--secondary)] rounded-lg transition-colors flex items-center justify-center gap-2 text-xs md:text-sm font-medium disabled:opacity-50"
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
                <span className="text-[var(--muted-foreground)]">{label}</span>
                <span className="font-bold">{value}%</span>
            </div>
            <div className="w-full bg-[var(--secondary)] rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};


const JournalList = ({ content }) => {
    const [currency, setCurrency] = useState('USD');
    let journals = [];

    // Currency rates (approximate as of 2024/Early 2025)
    // In a production app, fetch these from a live API
    const currencies = {
        'USD': { rate: 1, symbol: '$', name: 'US Dollar' },
        'INR': { rate: 85, symbol: '₹', name: 'Indian Rupee' },
        'EUR': { rate: 0.92, symbol: '€', name: 'Euro' },
        'GBP': { rate: 0.79, symbol: '£', name: 'British Pound' },
        'AUD': { rate: 1.52, symbol: 'A$', name: 'Australian Dollar' },
        'CAD': { rate: 1.35, symbol: 'C$', name: 'Canadian Dollar' },
        'JPY': { rate: 150, symbol: '¥', name: 'Japanese Yen' },
        'CNY': { rate: 7.2, symbol: '¥', name: 'Chinese Yuan' },
    };

    try {
        // Try parsing assuming it's pure JSON
        journals = JSON.parse(content);
    } catch (e) {
        console.error("Failed to parse journal JSON:", e);
        // Fallback: If it's a string or markdown wrapping, try to extract JSON
        const match = content.match(/\[.*\]/s);
        if (match) {
            try {
                journals = JSON.parse(match[0]);
            } catch (e2) {
                return (
                    <div className="text-red-400 p-4 border border-red-500/20 rounded-lg bg-red-500/10">
                        <p className="mb-2 font-semibold">Could not parse structured data.</p>
                        <pre className="whitespace-pre-wrap text-xs font-mono opacity-70">{content}</pre>
                    </div>
                );
            }
        } else {
            // Ultimate fallback: Render as text
            return (
                <div className="prose prose-invert max-w-none text-sm md:text-base">
                    {content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-3 md:mb-4 leading-relaxed">
                            {paragraph}
                        </p>
                    ))}
                </div>
            );
        }
    }

    if (!Array.isArray(journals)) return null;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h4 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Recommended Journals
                </h4>
                
                {/* Currency Selector */}
                <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-[var(--border)] w-fit">
                    <span className="text-xs text-[var(--muted-foreground)] pl-2">Currency:</span>
                    <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer py-1 pr-1"
                    >
                        {Object.keys(currencies).map(code => (
                            <option key={code} value={code} className="bg-[#1a1a1a] text-white">
                                {code} ({currencies[code].symbol})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                {journals.map((journal, idx) => (
                    <JournalItem 
                        key={idx} 
                        journal={journal} 
                        delay={idx * 0.1} 
                        currency={currency}
                        currencyData={currencies[currency]}
                    />
                ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3 text-xs md:text-sm text-yellow-200/80">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-500" />
                <p>
                    <strong>Disclaimer:</strong> Information regarding APCs, acceptance rates, and timelines are estimates generated by AI. 
                    Costs are converted from USD using approximate exchange rates ({currencies[currency].rate} {currency}/USD). 
                    Please strictly verify all details on the official journal websites before submission.
                </p>
            </div>
        </div>
    );
};

const JournalItem = ({ journal, delay, currency, currencyData }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Color code tiers
    const getTierColor = (tier) => {
        if (!tier) return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        const t = tier.toUpperCase();
        if (t.includes('Q1')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        if (t.includes('Q2')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        if (t.includes('Q3')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    };

    // Convert APC string
    const getConvertedAPC = (apcString) => {
        if (!apcString) return 'N/A';
        if (apcString.toLowerCase().includes('hybrid') || apcString.toLowerCase().includes('transformative')) {
            return apcString;
        }
        if (currency === 'USD') return apcString;

        try {
            // Find all number sequences (including commas)
            // e.g., "$2,500" -> "2,500"
            return apcString.replace(/[\d,]+/g, (match) => {
                const num = parseFloat(match.replace(/,/g, ''));
                if (isNaN(num)) return match;
                
                // Convert and format
                const converted = Math.round(num * currencyData.rate);
                return converted.toLocaleString(); // Add commas back
            }).replace(/\$/g, currencyData.symbol).replace(/USD/g, currency);
        } catch (e) {
            console.error("Error converting currency:", e);
            return apcString;
        }
    };

    const convertedAPC = getConvertedAPC(journal.apc);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--accent)]/50 hover:bg-[var(--accent)] transition-colors"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h5 className="font-semibold text-white/90 leading-tight">{journal.name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                            {journal.tier && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTierColor(journal.tier)}`}>
                                    {journal.tier}
                                </span>
                            )}
                            <span className="text-xs text-[var(--muted-foreground)]">{journal.publisher}</span>
                        </div>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--muted-foreground)]" /> : <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)]" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="px-4 pb-4 pt-1 border-t border-[var(--border)] space-y-3 text-sm">
                            <div className="p-3 bg-black/20 rounded-lg text-[var(--muted-foreground)] text-xs md:text-sm italic">
                                "{journal.reason}"
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <span className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1">Subject Area</span>
                                    <span className="text-white">{journal.subjectArea}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1">Indexing</span>
                                    <span className="text-white">{journal.indexing}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1">Est. Cost (APC)</span>
                                    <span className="text-white font-medium text-emerald-400">{convertedAPC}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1">Review Time</span>
                                    <span className="text-white">{journal.reviewTimeline}</span>
                                </div>
                            </div>
                            
                            {journal.website && (
                                <div className="pt-2">
                                    <a 
                                        href={journal.website.startsWith('http') ? journal.website : `https://${journal.website}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                                    >
                                        Visit Journal Website <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ContentWriter;

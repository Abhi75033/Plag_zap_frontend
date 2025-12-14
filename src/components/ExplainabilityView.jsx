import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const ExplainabilityView = ({ text, onAnalyze }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const data = await onAnalyze(text);
            setResult(data);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score < 30) return 'text-green-400 bg-green-500/20 border-green-500/30';
        if (score < 70) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        return 'text-red-400 bg-red-500/20 border-red-500/30';
    };

    const getScoreIcon = (score) => {
        if (score < 30) return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
        if (score < 70) return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
    };

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />
                    <h2 className="text-lg sm:text-2xl font-bold">Explainability Mode</h2>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !text}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base font-semibold transition-all shadow-lg shadow-purple-500/20"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Analyzing...' : 'Explain AI Detection'}
                </button>
            </div>

            {/* Overall Score - Mobile Optimized */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 sm:p-6 shadow-xl"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left w-full sm:w-auto">
                            <h3 className="text-base sm:text-lg font-semibold mb-1">Overall AI Detection</h3>
                            <p className="text-xs sm:text-sm text-gray-400">
                                Analyzed {result.analyzedSentences} of {result.totalSentences} sentences
                            </p>
                        </div>
                        <div className={`text-3xl sm:text-4xl font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 ${getScoreColor(result.overallAiScore)} shadow-lg`}>
                            {result.overallAiScore}%
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Sentence-by-Sentence Breakdown - Mobile Optimized */}
            {result && (
                <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
                        <span>Sentence Analysis</span>
                        <span className="text-xs sm:text-sm text-gray-400 px-2 py-1 bg-white/5 rounded-full">
                            {result.explanations.length} sentences
                        </span>
                    </h3>
                    
                    {result.explanations.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-white/25 transition-all shadow-lg hover:shadow-purple-500/10"
                        >
                            <button
                                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                                className="w-full p-3 sm:p-4 text-left flex items-start gap-2 sm:gap-4 active:bg-white/5 transition-colors"
                            >
                                {/* Score Badge - Mobile Optimized */}
                                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 ${getScoreColor(item.aiScore)}`}>
                                    {getScoreIcon(item.aiScore)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        {/* Sentence Text - Better mobile wrapping */}
                                        <p className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                                            {item.sentence}
                                        </p>
                                        {/* Score Badge - Mobile Optimized */}
                                        <span className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${getScoreColor(item.aiScore)}`}>
                                            {item.aiScore}%
                                        </span>
                                    </div>
                                    
                                    {/* Expand/Collapse Indicator */}
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        {expandedIndex === idx ? (
                                            <>
                                                <span>Hide details</span>
                                                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </>
                                        ) : (
                                            <>
                                                <span>Show explanation</span>
                                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {expandedIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-t border-white/10"
                                    >
                                        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white/5">
                                            {/* Explanation */}
                                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                <h4 className="text-xs sm:text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    Why might this be flagged?
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                                    {item.explanation}
                                                </p>
                                            </div>

                                            {/* Human Traits */}
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <h4 className="text-xs sm:text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Human-like traits
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                                    {item.humanTraits}
                                                </p>
                                            </div>

                                            {/* Suggestions */}
                                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                <h4 className="text-xs sm:text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                                    <Lightbulb className="w-3.5 h-3.5" />
                                                    Suggestions for improvement
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                                    {item.suggestions}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State - Mobile Optimized */}
            {!result && !loading && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-12 text-gray-400 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6"
                >
                    <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50 text-purple-400" />
                    <p className="mb-2 text-sm sm:text-base font-semibold">Click "Explain AI Detection" to analyze your text</p>
                    <p className="text-xs sm:text-sm text-gray-500">Get sentence-by-sentence explanations of AI detection patterns</p>
                </motion.div>
            )}

            {/* Loading State - Mobile Optimized */}
            {loading && !result && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-12 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20 p-6"
                >
                    <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-purple-400 animate-spin" />
                    <p className="mb-2 text-sm sm:text-base font-semibold text-purple-400">Analyzing your text...</p>
                    <p className="text-xs sm:text-sm text-gray-400">This may take a few seconds</p>
                </motion.div>
            )}
        </div>
    );
};

export default ExplainabilityView;

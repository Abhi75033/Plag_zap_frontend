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
        if (score < 30) return 'text-green-400 bg-green-500/20';
        if (score < 70) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    const getScoreIcon = (score) => {
        if (score < 30) return <CheckCircle className="w-5 h-5" />;
        if (score < 70) return <AlertCircle className="w-5 h-5" />;
        return <AlertCircle className="w-5 h-5" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold">Explainability Mode</h2>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !text}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Analyzing...' : 'Explain AI Detection'}
                </button>
            </div>

            {/* Overall Score */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Overall AI Detection</h3>
                            <p className="text-sm text-gray-400">
                                Analyzed {result.analyzedSentences} of {result.totalSentences} sentences
                            </p>
                        </div>
                        <div className={`text-4xl font-bold px-6 py-3 rounded-lg ${getScoreColor(result.overallAiScore)}`}>
                            {result.overallAiScore}%
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Sentence-by-Sentence Breakdown */}
            {result && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span>Sentence-by-Sentence Analysis</span>
                        <span className="text-sm text-gray-400">({result.explanations.length} sentences)</span>
                    </h3>
                    
                    {result.explanations.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
                        >
                            <button
                                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                                className="w-full p-4 text-left flex items-start gap-4"
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${getScoreColor(item.aiScore)}`}>
                                    {getScoreIcon(item.aiScore)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="text-sm font-medium line-clamp-2">{item.sentence}</p>
                                        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(item.aiScore)}`}>
                                            {item.aiScore}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        {expandedIndex === idx ? (
                                            <>
                                                <span>Hide details</span>
                                                <ChevronUp className="w-4 h-4" />
                                            </>
                                        ) : (
                                            <>
                                                <span>Show explanation</span>
                                                <ChevronDown className="w-4 h-4" />
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
                                        className="border-t border-white/10"
                                    >
                                        <div className="p-4 space-y-4 bg-white/5">
                                            {/* Explanation */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-purple-400 mb-2">
                                                    Why might this be flagged?
                                                </h4>
                                                <p className="text-sm text-gray-300">{item.explanation}</p>
                                            </div>

                                            {/* Human Traits */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-green-400 mb-2">
                                                    Human-like traits
                                                </h4>
                                                <p className="text-sm text-gray-300">{item.humanTraits}</p>
                                            </div>

                                            {/* Suggestions */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                                    Suggestions for improvement
                                                </h4>
                                                <p className="text-sm text-gray-300">{item.suggestions}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!result && !loading && (
                <div className="text-center py-12 text-gray-400">
                    <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">Click "Explain AI Detection" to analyze your text</p>
                    <p className="text-sm">Get sentence-by-sentence explanations of AI detection</p>
                </div>
            )}
        </div>
    );
};

export default ExplainabilityView;

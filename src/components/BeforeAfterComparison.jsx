import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingDown, TrendingUp, CheckCircle, X, Plus, Minus } from 'lucide-react';

const BeforeAfterComparison = ({ original, refined, metrics, onClose }) => {
    // Simple word-level diff
    const getDiff = () => {
        if (!original || !refined) return { removed: [], added: [], common: [] };
        
        const originalWords = original.split(/\s+/);
        const refinedWords = refined.split(/\s+/);
        
        const changes = {
            removed: [],
            added: [],
            common: []
        };
        
        // Find removed words (in original but not in refined)
        originalWords.forEach((word, i) => {
            if (!refinedWords.includes(word)) {
                changes.removed.push({ word, index: i });
            }
        });
        
        // Find added words (in refined but not in original)
        refinedWords.forEach((word, i) => {
            if (!originalWords.includes(word)) {
                changes.added.push({ word, index: i });
            }
        });
        
        return changes;
    };

    const diff = getDiff();

    const highlightText = (text, isOriginal) => {
        if (!text) return null;
        const words = text.split(/\s+/);
        const changeWords = isOriginal 
            ? diff.removed.map(c => c.word)
            : diff.added.map(c => c.word);
        
        return words.map((word, i) => {
            const isChanged = changeWords.includes(word);
            return (
                <span
                    key={i}
                    className={`${
                        isChanged
                            ? isOriginal
                                ? 'bg-red-500/20 text-red-300 px-1 rounded border border-red-500/30'
                                : 'bg-green-500/20 text-green-300 px-1 rounded border border-green-500/30'
                            : ''
                    }`}
                >
                    {word}{' '}
                </span>
            );
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                            <h2 className="text-xl sm:text-2xl font-bold">Before vs After Comparison</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Metrics Bar */}
                    {metrics && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {/* AI Risk Reduction */}
                            {metrics.aiRiskBefore !== undefined && metrics.aiRiskAfter !== undefined && (
                                <div className="bg-gradient-to-br from-red-500/10 to-green-500/10 border border-white/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingDown className="w-4 h-4 text-green-400" />
                                        <span className="text-xs sm:text-sm text-gray-400 font-semibold">AI Detection Risk</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xl sm:text-2xl font-bold text-red-400">
                                            {metrics.aiRiskBefore}%
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-gray-500" />
                                        <span className="text-xl sm:text-2xl font-bold text-green-400">
                                            {metrics.aiRiskAfter}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-400 mt-2 font-semibold">
                                        ↓ {metrics.aiRiskBefore - metrics.aiRiskAfter}% improvement
                                    </p>
                                </div>
                            )}

                            {/* Readability */}
                            {metrics.readabilityBefore && metrics.readabilityAfter && (
                                <div className="bg-gradient-to-br from-yellow-500/10 to-blue-500/10 border border-white/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs sm:text-sm text-gray-400 font-semibold">Readability Score</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xl sm:text-2xl font-bold text-yellow-400">
                                            {metrics.readabilityBefore}%
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-gray-500" />
                                        <span className="text-xl sm:text-2xl font-bold text-blue-400">
                                            {metrics.readabilityAfter}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-400 mt-2 font-semibold">
                                        ↑ {metrics.readabilityAfter - metrics.readabilityBefore}% better
                                    </p>
                                </div>
                            )}

                            {/* Changes Count */}
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs sm:text-sm text-gray-400 font-semibold">Content Changes</span>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                                    {diff.added.length + diff.removed.length}
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs">
                                    <span className="text-green-400 flex items-center gap-1">
                                        <Plus className="w-3 h-3" />
                                        {diff.added.length}
                                    </span>
                                    <span className="text-red-400 flex items-center gap-1">
                                        <Minus className="w-3 h-3" />
                                        {diff.removed.length}
                                    </span>
                                </div>
                            </div>

                            {/* Refinements Applied */}
                            {metrics.refinements && metrics.refinements.length > 0 && (
                                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-xs sm:text-sm text-gray-400 font-semibold">Refinements</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {metrics.refinements.slice(0, 3).map((ref, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30"
                                            >
                                                {ref}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Split View */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Original Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-2 border-red-500/30 rounded-xl p-4 sm:p-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-red-400 rounded-full shadow-lg shadow-red-500/50"></div>
                                <h3 className="font-bold text-base sm:text-lg text-red-400">Original</h3>
                                <span className="text-xs text-gray-500 ml-auto">
                                    {original?.split(/\s+/).length || 0} words
                                </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {original ? highlightText(original, true) : (
                                    <p className="text-gray-500 italic">No original content</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Refined Text */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-2 border-green-500/30 rounded-xl p-4 sm:p-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-500/50"></div>
                                <h3 className="font-bold text-base sm:text-lg text-green-400">Refined</h3>
                                <span className="text-xs text-gray-500 ml-auto">
                                    {refined?.split(/\s+/).length || 0} words
                                </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {refined ? highlightText(refined, false) : (
                                    <p className="text-gray-500 italic">No refined content yet</p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Legend */}
                    {(diff.added.length > 0 || diff.removed.length > 0) && (
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                            <span className="text-gray-400 font-semibold">Legend:</span>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500/20 border border-red-500/30 rounded"></div>
                                <span className="text-gray-400">Removed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded"></div>
                                <span className="text-gray-400">Added</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border-t border-white/10 p-4">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all shadow-lg shadow-purple-500/20"
                    >
                        Close Comparison
                    </button>
                </div>
            </motion.div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.7);
                }
            `}</style>
        </motion.div>
    );
};

export default BeforeAfterComparison;

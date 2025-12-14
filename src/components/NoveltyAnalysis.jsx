import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Lightbulb, AlertCircle, CheckCircle, Target, Loader2 } from 'lucide-react';

const NoveltyAnalysis = ({ analysis, loading }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                <p>Analyzing novelty and research gaps...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="text-center py-12 text-gray-400">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Submit your text and switch to this tab to analyze novelty</p>
            </div>
        );
    }

    const getNoveltyColor = (score) => {
        if (score >= 86) return 'text-emerald-400';
        if (score >= 61) return 'text-green-400';
        if (score >= 31) return 'text-yellow-400';
        return 'text-orange-400';
    };

    const getProgressColor = (score) => {
        if (score >= 86) return 'stroke-emerald-500';
        if (score >= 61) return 'stroke-green-500';
        if (score >= 31) return 'stroke-yellow-500';
        return 'stroke-orange-500';
    };

    const circumference = 2 * Math.PI * 56;
    const offset = circumference - (analysis.noveltyScore / 100) * circumference;

    return (
        <div className="space-y-6">
            {/* Novelty Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Novelty Assessment
                    </h3>
                    <span className={`text-sm font-semibold ${getNoveltyColor(analysis.noveltyScore)}`}>
                        {analysis.noveltyLevel}
                    </span>
                </div>

                {/* Score Circle */}
                <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                        <svg className="transform -rotate-90 w-32 h-32">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-700"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                className={`transition-all duration-1000 ${getProgressColor(analysis.noveltyScore)}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-3xl font-bold ${getNoveltyColor(analysis.noveltyScore)}`}>
                                {analysis.noveltyScore}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-300 text-sm">
                    {analysis.noveltyScore >= 86 && "Excellent! Highly original work with unique contributions."}
                    {analysis.noveltyScore >= 61 && analysis.noveltyScore < 86 && "Good! Fresh perspectives on established topics."}
                    {analysis.noveltyScore >= 31 && analysis.noveltyScore < 61 && "Fair. Some novel elements, but builds heavily on existing work."}
                    {analysis.noveltyScore < 31 && "Low novelty. Consider exploring unique angles and original contributions."}
                </p>
            </motion.div>

            {/* Key Concepts */}
            {analysis.keyConcepts && analysis.keyConcepts.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        Key Concepts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.keyConcepts.map((concept, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                            >
                                {concept}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Research Gaps */}
            {analysis.researchGaps && analysis.researchGaps.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        Research Gaps ({analysis.researchGaps.length})
                    </h4>
                    <div className="space-y-2">
                        {analysis.researchGaps.map((gap, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg border ${
                                    gap.importance === 'Critical' ? 'bg-red-500/10 border-red-500/30' :
                                    gap.importance === 'Moderate' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                    'bg-blue-500/10 border-blue-500/30'
                                }`}
                            >
                                <div className="flex items-start gap-2">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                                        gap.importance === 'Critical' ? 'bg-red-500/30 text-red-300' :
                                        gap.importance === 'Moderate' ? 'bg-yellow-500/30 text-yellow-300' :
                                        'bg-blue-500/30 text-blue-300'
                                    }`}>
                                        {gap.importance}
                                    </span>
                                    <p className="text-sm text-gray-300 flex-1">{gap.gap}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Unexplored Angles */}
            {analysis.unexploredAngles && analysis.unexploredAngles.length > 0 && (
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-purple-400" />
                        Unexplored Angles ({analysis.unexploredAngles.length})
                    </h4>
                    <div className="space-y-2">
                        {analysis.unexploredAngles.map((angle, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
                                    angle.potential === 'High' ? 'bg-emerald-500/30 text-emerald-300' :
                                    angle.potential === 'Medium' ? 'bg-yellow-500/30 text-yellow-300' :
                                    'bg-gray-500/30 text-gray-300'
                                }`}>
                                    {angle.potential}
                                </span>
                                <p className="text-gray-300 flex-1">{angle.angle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Strengths & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                {analysis.strengths && analysis.strengths.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Strengths
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                            {analysis.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                                    <span className="flex-1">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            Recommendations
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                            {analysis.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1 flex-shrink-0">→</span>
                                    <span className="flex-1">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoveltyAnalysis;

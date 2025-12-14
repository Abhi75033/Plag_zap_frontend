import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Award, AlertTriangle, CheckCircle, HelpCircle, 
    TrendingUp, BookOpen, MessageSquare, X, ChevronDown, ChevronUp 
} from 'lucide-react';

const SupervisorFeedback = ({ feedback, onClose }) => {
    const [expandedSections, setExpandedSections] = useState({
        structure: true,
        argument: true,
        academic: true,
        strengths: true,
        improvements: true,
        questions: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'CRITICAL': return 'from-red-500/20 to-red-600/20 border-red-500/30';
            case 'MODERATE': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
            case 'MINOR': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
            default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
        }
    };

    const getGradeColor = (grade) => {
        if (grade.includes('First')) return 'text-emerald-400';
        if (grade.includes('Upper')) return 'text-green-400';
        if (grade.includes('Lower')) return 'text-yellow-400';
        if (grade.includes('Third')) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-white" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Supervisor Feedback</h2>
                                <p className="text-purple-100 text-sm">Academic quality assessment</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Overall Grade */}
                    <div className="mt-4 bg-black/20 rounded-xl p-4 border border-white/10">
                        <p className="text-purple-100 text-sm mb-1">Overall Assessment</p>
                        <p className={`text-2xl font-bold ${getGradeColor(feedback.overallGrade)}`}>
                            {feedback.overallGrade}
                        </p>
                    </div>
                </div>

                {/* Feedback Content */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
                    
                    {/* Criterion Scores */}
                    <FeedbackSection
                        title="Structure & Organization"
                        icon={<BookOpen />}
                        expanded={expandedSections.structure}
                        onToggle={() => toggleSection('structure')}
                        score={feedback.structure.score}
                        comments={feedback.structure.comments}
                        severity={feedback.structure.severity}
                        getSeverityColor={getSeverityColor}
                    />

                    <FeedbackSection
                        title="Argument & Analysis"
                        icon={<TrendingUp />}
                        expanded={expandedSections.argument}
                        onToggle={() => toggleSection('argument')}
                        score={feedback.argument.score}
                        comments={feedback.argument.comments}
                        severity={feedback.argument.severity}
                        getSeverityColor={getSeverityColor}
                    />

                    <FeedbackSection
                        title="Academic Quality"
                        icon={<Award />}
                        expanded={expandedSections.academic}
                        onToggle={() => toggleSection('academic')}
                        score={feedback.academicQuality.score}
                        comments={feedback.academicQuality.comments}
                        severity={feedback.academicQuality.severity}
                        getSeverityColor={getSeverityColor}
                    />

                    {/* Strengths */}
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                        <button
                            onClick={() => toggleSection('strengths')}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <h3 className="font-semibold text-white">Strengths ({feedback.strengths.length})</h3>
                            </div>
                            {expandedSections.strengths ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        <AnimatePresence>
                            {expandedSections.strengths && (
                                <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-3 space-y-2 text-sm text-gray-300"
                                >
                                    {feedback.strengths.map((strength, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">✓</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Improvements */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <button
                            onClick={() => toggleSection('improvements')}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                <h3 className="font-semibold text-white">Areas for Improvement ({feedback.improvements.length})</h3>
                            </div>
                            {expandedSections.improvements ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        <AnimatePresence>
                            {expandedSections.improvements && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-3 space-y-2"
                                >
                                    {feedback.improvements.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`bg-gradient-to-r ${getSeverityColor(item.severity)} rounded-lg p-3 border`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className={`
                                                    px-2 py-0.5 rounded text-xs font-semibold
                                                    ${item.severity === 'CRITICAL' ? 'bg-red-500/30 text-red-300' : ''}
                                                    ${item.severity === 'MODERATE' ? 'bg-yellow-500/30 text-yellow-300' : ''}
                                                    ${item.severity === 'MINOR' ? 'bg-blue-500/30 text-blue-300' : ''}
                                                `}>
                                                    {item.severity}
                                                </span>
                                                <p className="text-sm text-gray-300 flex-1">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Questions */}
                    {feedback.questionsForStudent.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-4">
                            <button
                                onClick={() => toggleSection('questions')}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-purple-400" />
                                    <h3 className="font-semibold text-white">Questions to Consider ({feedback.questionsForStudent.length})</h3>
                                </div>
                                {expandedSections.questions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            <AnimatePresence>
                                {expandedSections.questions && (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-3 space-y-2 text-sm text-gray-300"
                                    >
                                        {feedback.questionsForStudent.map((question, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <MessageSquare className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                                <span>{question}</span>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

const FeedbackSection = ({ title, icon, expanded, onToggle, score, comments, severity, getSeverityColor }) => (
    <div className={`bg-gradient-to-r ${getSeverityColor(severity)} rounded-xl p-4 border`}>
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between text-left"
        >
            <div className="flex items-center gap-2">
                {React.cloneElement(icon, { className: 'w-5 h-5 text-purple-400' })}
                <h3 className="font-semibold text-white">{title}</h3>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-purple-300">{score}/10</span>
                {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
        </button>
        <AnimatePresence>
            {expanded && (
                <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-2 text-sm text-gray-300"
                >
                    {comments.map((comment, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{comment}</span>
                        </li>
                    ))}
                </motion.ul>
            )}
        </AnimatePresence>
    </div>
);

export default SupervisorFeedback;

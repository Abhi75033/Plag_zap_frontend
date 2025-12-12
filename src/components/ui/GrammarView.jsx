import React, { useState } from 'react';
import { Check, X, Wand2, AlertCircle, BookOpen, Type, Lightbulb, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const GrammarView = ({ text, result, onApplyFixes }) => {
  const [activeIssue, setActiveIssue] = useState(null);
  const [selectedFixes, setSelectedFixes] = useState(new Set());

  // Show message when no result
  if (!result) {
    return (
      <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-400/50" />
        <h3 className="text-lg font-bold text-gray-300 mb-2">Grammar Check Unavailable</h3>
        <p className="text-sm text-gray-500 mb-4">
          Grammar analysis couldn't be loaded. Run the analysis again to check grammar.
        </p>
      </div>
    );
  }

  const { score, issues, summary, issueCount } = result;

  // Toggle fix selection
  const toggleFix = (idx) => {
    const newSelected = new Set(selectedFixes);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedFixes(newSelected);
  };

  // Select all fixes
  const selectAll = () => {
    setSelectedFixes(new Set(issues.map((_, idx) => idx)));
  };

  // Apply selected fixes
  const handleApplyFixes = () => {
    const selectedIssues = issues.filter((_, idx) => selectedFixes.has(idx));
    if (onApplyFixes && selectedIssues.length > 0) {
      onApplyFixes(selectedIssues);
    }
  };

  // Get icon for issue type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'grammar': return <BookOpen className="w-3 h-3" />;
      case 'spelling': return <Type className="w-3 h-3" />;
      case 'style': return <Lightbulb className="w-3 h-3" />;
      case 'clarity': return <Eye className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  // Get color for issue type
  const getTypeColor = (type) => {
    switch (type) {
      case 'grammar': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'spelling': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'style': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'clarity': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Highlight text with issues
  const renderHighlightedText = () => {
    if (!issues || issues.length === 0) {
      return <span className="text-gray-300">{text}</span>;
    }

    let lastIndex = 0;
    const elements = [];
    
    issues.forEach((issue, idx) => {
      const start = text.indexOf(issue.original, lastIndex);
      if (start === -1) return;

      const end = start + issue.original.length;

      // Add text before issue
      if (start > lastIndex) {
        elements.push(<span key={`text-${idx}`}>{text.substring(lastIndex, start)}</span>);
      }

      // Add highlighted issue
      elements.push(
        <span 
          key={`issue-${idx}`}
          onClick={() => setActiveIssue(idx)}
          className={`cursor-pointer border-b-2 transition-all ${
            activeIssue === idx 
              ? 'bg-red-500/30 border-red-500' 
              : 'border-red-500/50 hover:bg-red-500/20'
          } ${selectedFixes.has(idx) ? 'line-through opacity-50' : ''}`}
          title={issue.explanation}
        >
          {issue.original}
        </span>
      );

      lastIndex = end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-gray-200">Grammar & Style Score</h4>
          <span className={`text-2xl font-bold ${score > 80 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {score}/100
          </span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-2 mb-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            className={`h-2 rounded-full ${score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          />
        </div>
        <p className="text-sm text-gray-400">{summary}</p>
        
        {/* Issue counts */}
        {issueCount && (
          <div className="flex gap-3 mt-3 text-xs">
            {issueCount.grammar > 0 && (
              <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded">
                {issueCount.grammar} Grammar
              </span>
            )}
            {issueCount.spelling > 0 && (
              <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded">
                {issueCount.spelling} Spelling
              </span>
            )}
            {issueCount.style > 0 && (
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                {issueCount.style} Style
              </span>
            )}
            {issueCount.clarity > 0 && (
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded">
                {issueCount.clarity} Clarity
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Highlighted Text */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 leading-relaxed text-lg text-gray-200 whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
          {renderHighlightedText()}
        </div>

        {/* Issues Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Actions */}
          {issues && issues.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={selectAll}
                className="flex-1 py-2 px-3 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Select All
              </button>
              <button 
                onClick={handleApplyFixes}
                disabled={selectedFixes.size === 0}
                className="flex-1 py-2 px-3 text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                Apply ({selectedFixes.size})
              </button>
            </div>
          )}

          {/* Issues List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {(!issues || issues.length === 0) && (
              <div className="text-center p-8 text-gray-500">
                <Check className="w-12 h-12 mx-auto mb-2 text-green-500/50" />
                <p>No issues found! 🎉</p>
                <p className="text-xs mt-1">Your text looks great.</p>
              </div>
            )}
            
            {issues && issues.map((issue, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setActiveIssue(idx);
                  toggleFix(idx);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedFixes.has(idx)
                    ? 'bg-green-500/10 border-green-500/50'
                    : activeIssue === idx 
                      ? 'bg-white/10 border-white/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 ${getTypeColor(issue.type)}`}>
                    {getTypeIcon(issue.type)}
                    {issue.type}
                  </span>
                  {selectedFixes.has(idx) && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="mb-2">
                  <span className="line-through text-red-400/70 text-sm mr-2">{issue.original}</span>
                  <span className="text-green-400 font-medium text-sm">→ {issue.corrected}</span>
                </div>
                <p className="text-xs text-gray-400">{issue.explanation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarView;

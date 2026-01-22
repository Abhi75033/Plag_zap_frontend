import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Download, BookOpen, Zap, CheckCircle } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ScoreGauge from './ScoreGauge';
import AnalysisReport from '../pdf/AnalysisReport';
import StatsDonut from './StatsDonut';

const AnalysisResultsPanel = ({ result, text, user, handleRewrite, setCitationSource }) => {
  if (!result) return null;

  // Calculate counts for the donut
  const plagiarizedCount = result.highlights.filter(h => h.type === 'plagiarized').length;
  const paraphrasedCount = result.highlights.filter(h => h.type === 'paraphrased').length;
  const uniqueCount = result.highlights.filter(h => h.type === 'safe').length;

  // Debug: Log the AI score
  console.log('📊 AnalysisResultsPanel - AI Score:', result.aiScore);

  return (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-background/40 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-6 shadow-2xl overflow-hidden relative group"
    >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-700"></div>

        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-[var(--muted-foreground)]">Analysis Results</h3>
        
        {/* Main Score Card with Donut */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-white/5 to-white/0 rounded-xl sm:rounded-2xl border border-[var(--border)] shadow-inner relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shine" />
            
            <div className="mb-4 sm:mb-6 relative z-10 transition-transform duration-500 hover:scale-105">
                <StatsDonut 
                    plagiarized={plagiarizedCount} 
                    paraphrased={paraphrasedCount} 
                    unique={uniqueCount}
                    aiScore={result.aiScore || 0}
                />
            </div>
            
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] italic mt-2 sm:mt-3 leading-relaxed text-center max-w-xs sm:max-w-md px-2">{result.aiReason}</p>
            
            <div className="mt-4 sm:mt-6 w-full">
                <button
                    onClick={handleRewrite}
                    className="w-full py-3 sm:py-4 px-4 sm:px-5 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-sm sm:text-base font-bold text-white transition-all shadow-lg sm:shadow-xl hover:shadow-purple-500/40 flex items-center justify-center gap-2 sm:gap-2.5 transform hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100"
                >
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                    <span className="truncate">Make Content Unique</span>
                </button>
                <div className="mt-3 sm:mt-4 flex items-start gap-2 sm:gap-2.5 p-2.5 sm:p-3.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl">
                    <span className="text-base sm:text-lg flex-shrink-0">⚠️</span>
                    <p className="text-[10px] sm:text-xs text-[var(--warning-text)] leading-relaxed font-medium">", "StartLine": 53
                        AI rewrites may vary. Always review the output for accuracy and tone.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8 transform scale-90 sm:scale-95">
            <ScoreGauge score={result.overallScore} />
        </div>
        
        {/* Stats Grid */}
        <div className="space-y-3">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">Plagiarized</span>
                </div>
                <span className="font-bold text-red-400">
                {result.highlights.filter(h => h.type === 'plagiarized').length} <span className="text-xs font-normal opacity-60">chunks</span>
                </span>
            </div>
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">Paraphrased</span>
                </div>
                <span className="font-bold text-orange-400">
                {result.highlights.filter(h => h.type === 'paraphrased').length} <span className="text-xs font-normal opacity-60">chunks</span>
                </span>
            </div>
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-emerald-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">Unique</span>
                </div>
                <span className="font-bold text-emerald-400">
                {result.highlights.filter(h => h.type === 'safe').length} <span className="text-xs font-normal opacity-60">chunks</span>
                </span>
            </div>
        </div>

        {/* Detected Sources List */}
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                 <h4 className="font-bold text-xs text-[var(--muted-foreground)] uppercase tracking-widest">Detected Sources</h4>
                 <div className="flex-1 h-px bg-[var(--accent)]"></div>
            </div>
            
            {result.matches && result.matches.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {result.matches.map((source, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="group/source p-3.5 bg-[var(--accent)] hover:bg-[var(--secondary)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300"
                        >
                            <div className="font-medium text-sm text-foreground truncate mb-1" title={source.title || 'Unknown Source'}>
                                {source.title || 'Unknown Source'}
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300 text-xs truncate flex-1 hover:underline decoration-blue-500/30">
                                    {source.url}
                                </a>
                                <button 
                                    onClick={() => setCitationSource(source)}
                                    className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all opacity-0 group-hover/source:opacity-100"
                                    title="Cite this source"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="p-6 rounded-2xl bg-[var(--accent)] border border-dashed border-[var(--border)] text-center flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500/50" />
                    <p className="text-sm text-[var(--muted-foreground)] font-medium">No external sources detected.</p>
                </div>
            )}
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-[var(--border)]">
            <PDFDownloadLink
                document={<AnalysisReport result={result} text={text} userName={user?.name} />}
                fileName={`PlagZap-Report-${new Date().toISOString().slice(0,10)}.pdf`}
                className="flex-1 bg-[var(--accent)] hover:bg-[var(--secondary)] border border-[var(--border)] text-foreground font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
                {({ blob, url, loading, error }) => (
                    <>
                        {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="h-4 w-4" />}
                        <span className="text-sm">Report</span>
                    </>
                )}
            </PDFDownloadLink>

            <button
                onClick={handleRewrite}
                className="flex-1 bg-white text-black hover:bg-gray-100 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
            >
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Fix Text</span>
            </button>
        </div>
    </motion.div>
  );
};

export default AnalysisResultsPanel;

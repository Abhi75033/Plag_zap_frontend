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

  return (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group"
    >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-700"></div>

        <h3 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Analysis Results</h3>
        
        {/* Main Score Card with Donut */}
        <div className="mb-8 p-6 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 shadow-inner relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shine" />
            
            <div className="mb-6 relative z-10 transition-transform duration-500 hover:scale-105">
                <StatsDonut 
                    plagiarized={plagiarizedCount} 
                    paraphrased={paraphrasedCount} 
                    unique={uniqueCount} 
                />
            </div>
            
            <p className="text-xs text-gray-400 italic mt-2 leading-relaxed opacity-80 text-center max-w-xs">{result.aiReason}</p>
            
            <div className="mt-6 w-full">
                <button
                    onClick={handleRewrite}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-sm font-bold text-white transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Make Content Unique
                </button>
                <div className="mt-3 flex items-start gap-2 p-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                    <span className="text-base">⚠️</span>
                    <p className="text-[10px] text-orange-200/70 leading-tight">
                        AI rewrites may vary. Always review the output for accuracy and tone.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex justify-center mb-8 transform scale-95">
            <ScoreGauge score={result.overallScore} />
        </div>
        
        {/* Stats Grid */}
        <div className="space-y-3">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <span className="text-sm font-medium text-gray-300">Plagiarized</span>
                </div>
                <span className="font-bold text-red-400">
                {result.highlights.filter(h => h.type === 'plagiarized').length} <span className="text-xs font-normal opacity-60">chunks</span>
                </span>
            </div>
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    <span className="text-sm font-medium text-gray-300">Paraphrased</span>
                </div>
                <span className="font-bold text-orange-400">
                {result.highlights.filter(h => h.type === 'paraphrased').length} <span className="text-xs font-normal opacity-60">chunks</span>
                </span>
            </div>
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-emerald-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span className="text-sm font-medium text-gray-300">Unique</span>
                </div>
                <span className="font-bold text-emerald-400">
                {result.highlights.filter(h => h.type === 'safe').length} <span className="text-xs font-normal opacity-60">chunks</span>
                </span>
            </div>
        </div>

        {/* Detected Sources List */}
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                 <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest">Detected Sources</h4>
                 <div className="flex-1 h-px bg-white/5"></div>
            </div>
            
            {result.matches && result.matches.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {result.matches.map((source, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="group/source p-3.5 bg-black/20 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300"
                        >
                            <div className="font-medium text-sm text-gray-200 truncate mb-1" title={source.title || 'Unknown Source'}>
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
                <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500/50" />
                    <p className="text-sm text-gray-400 font-medium">No external sources detected.</p>
                </div>
            )}
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
            <PDFDownloadLink
                document={<AnalysisReport result={result} text={text} userName={user?.name} />}
                fileName={`PlagZap-Report-${new Date().toISOString().slice(0,10)}.pdf`}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
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

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Download, BookOpen, Zap } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ScoreGauge from './ScoreGauge';
import AnalysisReport from '../pdf/AnalysisReport';

const AnalysisResultsPanel = ({ result, text, user, handleRewrite, setCitationSource }) => {
  if (!result) return null;

  return (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
    >
        <h3 className="text-xl font-bold mb-6 text-center">Analysis Results</h3>
        
        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">AI Content Score</span>
                <span className={`text-xl font-bold ${(result.aiScore || 0) > 50 ? 'text-red-400' : 'text-green-400'}`}>
                    {result.aiScore !== undefined && result.aiScore !== null ? result.aiScore : 0}%
                </span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-2 mb-2">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.aiScore || 0}%` }}
                    className={`h-2 rounded-full ${(result.aiScore || 0) > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                />
            </div>
            <p className="text-xs text-gray-500 italic mt-2">{result.aiReason}</p>
            
            <div className="mt-3">
                <button
                    onClick={handleRewrite}
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                    <Sparkles className="h-3 w-3" />
                    Make Text Unique (Fix Both)
                </button>
                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-xs text-yellow-400 flex items-start gap-1.5">
                        <span className="text-sm">⚠️</span>
                        <span>Please verify the rewritten text yourself. AI may make mistakes or change meaning slightly.</span>
                    </p>
                </div>
            </div>
        </div>

        <div className="flex justify-center mb-8">
            <ScoreGauge score={result.overallScore} />
        </div>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-red-400">Plagiarized</span>
                <span className="font-bold">
                {result.highlights.filter(h => h.type === 'plagiarized').length} chunks
                </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <span className="text-orange-400">Paraphrased</span>
                <span className="font-bold">
                {result.highlights.filter(h => h.type === 'paraphrased').length} chunks
                </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="text-green-400">Unique</span>
                <span className="font-bold">
                {result.highlights.filter(h => h.type === 'safe').length} chunks
                </span>
            </div>
        </div>

        {/* Detected Sources List */}
        <div className="mt-6">
            <h4 className="font-bold text-sm text-gray-400 mb-3 uppercase tracking-wider">Detected Sources</h4>
            
            {result.matches && result.matches.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {result.matches.map((source, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 text-sm">
                            <div className="font-bold truncate mb-1" title={source.title}>{source.title || 'Unknown Source'}</div>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs block truncate mb-2">
                                {source.url}
                            </a>
                            <button 
                                onClick={() => setCitationSource(source)}
                                className="w-full py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                            >
                                <BookOpen className="w-3 h-3" />
                                Cite Source
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-gray-500">No external sources detected.</p>
                </div>
            )}
        </div>

        <div className="flex gap-3 mt-6">
            <PDFDownloadLink
                document={<AnalysisReport result={result} text={text} userName={user?.name} />}
                fileName={`PlagZap-Report-${new Date().toISOString().slice(0,10)}.pdf`}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
                {({ blob, url, loading, error }) => (
                    <>
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="h-5 w-5" />}
                        {loading ? 'Generating...' : 'Report'}
                    </>
                )}
            </PDFDownloadLink>

            <button
                onClick={handleRewrite}
                className="flex-1 bg-white text-black dark:bg-white dark:text-black hover:bg-gray-200 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 relative z-50 cursor-pointer"
            >
                <Sparkles className="h-5 w-5" />
                Fix Plagiarism
            </button>
        </div>
    </motion.div>
  );
};

export default AnalysisResultsPanel;

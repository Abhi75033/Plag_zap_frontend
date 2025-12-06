import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory } from '../services/api';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { FileText, Calendar, AlertCircle, X, ExternalLink, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleCopyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 50) return 'text-red-500 dark:text-red-400';
    if (score >= 25) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 50) return 'bg-red-500/10 border-red-500/20';
    if (score >= 25) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-green-500/10 border-green-500/20';
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-foreground">Analysis History</h1>
      <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12">
        Click on any card to view full details
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-600" />
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">No history yet</h3>
          <p className="text-neutral-500 dark:text-neutral-500">Your analysis history will appear here</p>
        </div>
      ) : (
        <BentoGrid>
          {history.map((item, i) => (
            <BentoGridItem
              key={item._id}
              onClick={() => handleViewDetails(item)}
              title={`Analysis #${item._id.slice(-6)}`}
              description={
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getScoreColor(item.overallScore)}`}>
                      Risk Score: {item.overallScore}%
                    </span>
                  </div>
                </div>
              }
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 p-4 overflow-hidden relative group border border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-4 group-hover:opacity-50 transition-opacity">
                    {item.originalText}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-sm font-bold flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </span>
                  </div>
                </div>
              }
              icon={<FileText className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-neutral-200 dark:border-neutral-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Analysis #{selectedItem._id.slice(-6)}
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>

              {/* Score Section */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getScoreBgColor(selectedItem.overallScore)}`}>
                  <AlertCircle className={`w-5 h-5 ${getScoreColor(selectedItem.overallScore)}`} />
                  <span className={`text-lg font-bold ${getScoreColor(selectedItem.overallScore)}`}>
                    Risk Score: {selectedItem.overallScore}%
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 overflow-y-auto max-h-[40vh]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                    Original Text
                  </h3>
                  <button
                    onClick={() => handleCopyText(selectedItem.originalText)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.originalText}
                  </p>
                </div>

                {/* Highlights Section */}
                {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                      Analysis Breakdown
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.highlights.slice(0, 5).map((highlight, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            highlight.type === 'plagiarized'
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold uppercase ${
                              highlight.type === 'plagiarized'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-green-600 dark:text-green-400'
                            }`}>
                              {highlight.type}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              Score: {highlight.score}%
                            </span>
                          </div>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                            {highlight.text}
                          </p>
                          {highlight.source && highlight.type === 'plagiarized' && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                              Source: {highlight.source}
                            </p>
                          )}
                        </div>
                      ))}
                      {selectedItem.highlights.length > 5 && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-2">
                          +{selectedItem.highlights.length - 5} more chunks
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Rewritten Text */}
                {selectedItem.rewrittenText && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                      Rewritten Text
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                      <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                        {selectedItem.rewrittenText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;

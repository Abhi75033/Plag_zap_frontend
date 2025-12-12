import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Clock, Loader2, Download, RefreshCw } from 'lucide-react';

const BatchResults = ({ batchId, onClose }) => {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch batch status
  const fetchBatch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/plagiarism/bulk/${batchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch batch');
      
      const data = await response.json();
      setBatch(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates while processing
  useEffect(() => {
    fetchBatch();
    
    const interval = setInterval(() => {
      if (batch?.status !== 'completed') {
        fetchBatch();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [batchId]);

  // Stop polling when completed
  useEffect(() => {
    if (batch?.status === 'completed') {
      // Final fetch to get summary
      fetchBatch();
    }
  }, [batch?.status]);

  const getScoreColor = (score) => {
    if (score <= 20) return 'text-green-400';
    if (score <= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score <= 20) return 'bg-green-500/20';
    if (score <= 50) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  if (loading && !batch) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-purple-500" />
        <p className="text-gray-400">Loading batch results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-10 h-10 mx-auto mb-4 text-red-400" />
        <p className="text-red-400">{error}</p>
        <button 
          onClick={fetchBatch}
          className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!batch) return null;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {batch.status === 'completed' ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : batch.status === 'processing' ? (
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            ) : (
              <Clock className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <h3 className="font-bold text-white">
                {batch.status === 'completed' ? 'Batch Complete' : 'Processing...'}
              </h3>
              <p className="text-sm text-gray-400">
                {batch.processedItems} of {batch.totalItems} items
              </p>
            </div>
          </div>
          {batch.status === 'processing' && (
            <button 
              onClick={fetchBatch}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-black/30 rounded-full h-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${batch.progress}%` }}
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Summary (when complete) */}
      {batch.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-green-400">{batch.summary.totalClean}</p>
            <p className="text-xs text-gray-400">Clean</p>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-red-400">{batch.summary.totalPlagiarized}</p>
            <p className="text-xs text-gray-400">Flagged</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-2xl font-bold text-white">{batch.summary.avgPlagiarismScore}%</p>
            <p className="text-xs text-gray-400">Avg Plagiarism</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-2xl font-bold text-white">{batch.summary.avgAiScore}%</p>
            <p className="text-xs text-gray-400">Avg AI Score</p>
          </div>
        </div>
      )}

      {/* Individual Results */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Results</h4>
        {batch.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border transition-all ${
              item.status === 'completed' 
                ? 'bg-white/5 border-white/10' 
                : item.status === 'failed'
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-white/5 border-white/5 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  item.status === 'completed' && item.result
                    ? getScoreBg(item.result.overallScore)
                    : 'bg-gray-500/10'
                }`}>
                  {item.status === 'completed' ? (
                    <FileText className="w-4 h-4 text-gray-300" />
                  ) : item.status === 'processing' ? (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  ) : item.status === 'failed' ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{item.filename}</p>
                  {item.error && (
                    <p className="text-xs text-red-400">{item.error}</p>
                  )}
                </div>
              </div>
              
              {item.result && (
                <div className="text-right">
                  <p className={`text-xl font-bold ${getScoreColor(item.result.overallScore)}`}>
                    {item.result.overallScore}%
                  </p>
                  <p className="text-xs text-gray-500">
                    P: {item.result.plagarismScore}% | AI: {item.result.aiScore}%
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      {batch.status === 'completed' && (
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchResults;

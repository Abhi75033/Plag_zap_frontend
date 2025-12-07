import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, shareHistoryWithTeam } from '../services/api';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { FileText, Calendar, Share2, X, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState(null); // item to share
  const [shareTitle, setShareTitle] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareModal) return;
    setSharing(true);
    try {
      await shareHistoryWithTeam(shareModal._id, shareTitle || `Analysis from ${new Date(shareModal.createdAt).toLocaleDateString()}`);
      toast.success('Shared with your team!');
      setShareModal(null);
      setShareTitle('');
      // Update local state to show it's shared
      setHistory(prev => prev.map(h => 
        h._id === shareModal._id ? { ...h, sharedWithTeam: true } : h
      ));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to share');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center">Analysis History</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No analyses yet. Start by checking some text!</p>
        </div>
      ) : (
        <BentoGrid>
          {history.map((item, i) => (
            <BentoGridItem
              key={item._id}
              title={
                <div className="flex items-center justify-between">
                  <span>Analysis #{item._id.slice(-6)}</span>
                  {item.sharedWithTeam && (
                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full flex items-center gap-1">
                      <Users className="w-3 h-3" /> Shared
                    </span>
                  )}
                </div>
              }
              description={
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${
                      item.overallScore > 50 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      Score: {item.overallScore}%
                    </span>
                    {!item.sharedWithTeam && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareModal(item);
                        }}
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              }
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4 overflow-hidden relative group">
                  <p className="text-xs text-gray-500 line-clamp-4 group-hover:text-gray-300 transition-colors">
                    {item.originalText}
                  </p>
                </div>
              }
              icon={<FileText className="h-4 w-4 text-neutral-500" />}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {shareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShareModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  Share with Team
                </h3>
                <button onClick={() => setShareModal(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Share this analysis with your team members. They'll be able to see it in the Team → Shared tab.
              </p>

              <input
                type="text"
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-purple-500"
              />

              <div className="bg-white/5 rounded-lg p-3 mb-4 text-sm text-gray-400">
                <p><strong>Score:</strong> {shareModal.overallScore}%</p>
                <p className="text-xs mt-1 truncate">{shareModal.originalText?.slice(0, 100)}...</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShareModal(null)}
                  className="flex-1 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sharing ? 'Sharing...' : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;


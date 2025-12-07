import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Share2, Clock, User, MessageCircle, Send, X, Lightbulb, Trash2, Eye } from 'lucide-react';
import { getTeamHistory, getSharedHistoryDetails, addHistoryComment, deleteHistoryComment } from '../services/api';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const SharedHistory = () => {
    const { user } = useAppContext();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentType, setCommentType] = useState('comment');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadHistory();
    }, [page]);

    const loadHistory = async () => {
        try {
            const { data } = await getTeamHistory(page);
            setHistory(data.history || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to load team history', error);
        } finally {
            setLoading(false);
        }
    };

    const openDetails = async (item) => {
        setDetailsLoading(true);
        setSelectedItem({ ...item, comments: [], highlights: [] });
        try {
            const { data } = await getSharedHistoryDetails(item._id);
            setSelectedItem(data.history);
        } catch (error) {
            toast.error('Failed to load details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !selectedItem) return;
        setSending(true);
        try {
            const { data } = await addHistoryComment(selectedItem._id, newComment, commentType);
            setSelectedItem(prev => ({
                ...prev,
                comments: [...(prev.comments || []), data.comment]
            }));
            setNewComment('');
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setSending(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteHistoryComment(selectedItem._id, commentId);
            setSelectedItem(prev => ({
                ...prev,
                comments: prev.comments.filter(c => c._id !== commentId)
            }));
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const getScoreColor = (score) => {
        if (score < 20) return 'text-green-400 bg-green-500/20';
        if (score < 50) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    const getHighlightColor = (type) => {
        if (type === 'plagiarized') return 'bg-red-500/30 text-red-300';
        if (type === 'paraphrased') return 'bg-yellow-500/30 text-yellow-300';
        return 'bg-green-500/30 text-green-300';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-400" />
                    Shared Analyses ({pagination?.total || 0})
                </h3>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No shared analyses yet</p>
                    <p className="text-sm mt-1">Share from History page</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {history.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors"
                            >
                                {/* Main Card - Clickable */}
                                <div 
                                    onClick={() => openDetails(item)}
                                    className="p-3 sm:p-4 cursor-pointer group"
                                >
                                    {/* Header with title and score */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h4 className="font-medium text-white text-sm sm:text-base line-clamp-1 flex-1">
                                            {item.title || 'Untitled Analysis'}
                                        </h4>
                                        <div className={`px-2 py-0.5 rounded-full text-xs sm:text-sm font-bold flex-shrink-0 ${getScoreColor(item.overallScore)}`}>
                                            {item.overallScore?.toFixed(0)}%
                                        </div>
                                    </div>
                                    
                                    {/* Preview text */}
                                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-2">
                                        {item.originalText?.slice(0, 100)}...
                                    </p>
                                    
                                    {/* Metadata - wraps on mobile */}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {item.userId?.name?.split(' ')[0] || 'Unknown'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                        {item.comments?.length > 0 && (
                                            <span className="flex items-center gap-1 text-purple-400">
                                                <MessageCircle className="w-3 h-3" />
                                                {item.comments.length}
                                            </span>
                                        )}
                                        <Eye className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                                    </div>
                                </div>

                                {/* Comments Section - Simplified for mobile */}
                                {item.comments && item.comments.length > 0 && (
                                    <div className="border-t border-white/10 bg-black/30 px-3 py-2">
                                        <div className="space-y-1.5">
                                            {item.comments.slice(-2).map((comment) => (
                                                <div key={comment._id} className="flex items-start gap-2">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                                                        {comment.userId?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            <span className="text-[10px] font-medium text-white">{comment.userId?.name?.split(' ')[0]}</span>
                                                            {comment.type === 'suggestion' && (
                                                                <span className="text-[9px] px-1 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">💡</span>
                                                            )}
                                                            {comment.type === 'feedback' && (
                                                                <span className="text-[9px] px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded">📝</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 line-clamp-1">{comment.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {item.comments.length > 2 && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); openDetails(item); }}
                                                    className="text-[10px] text-purple-400 hover:text-purple-300"
                                                >
                                                    +{item.comments.length - 2} more →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 transition-colors"
                            >Previous</button>
                            <span className="px-4 py-2 text-gray-400">{page} / {pagination.pages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 transition-colors"
                            >Next</button>
                        </div>
                    )}
                </>
            )}

            {/* Details Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <div>
                                    <h3 className="text-lg font-bold">{selectedItem.title || 'Analysis Details'}</h3>
                                    <p className="text-sm text-gray-400">
                                        By {selectedItem.userId?.name} • {formatDate(selectedItem.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(selectedItem.overallScore)}`}>
                                        {selectedItem.overallScore?.toFixed(0)}% Match
                                    </span>
                                    <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {detailsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin h-6 w-6 border-b-2 border-purple-500 rounded-full"></div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Original Text with Highlights */}
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-purple-400" />
                                                Analyzed Text
                                            </h4>
                                            <div className="bg-black/30 rounded-lg p-4 text-sm text-gray-300 max-h-48 overflow-y-auto">
                                                {selectedItem.originalText}
                                            </div>
                                        </div>

                                        {/* Highlights */}
                                        {selectedItem.highlights?.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Findings ({selectedItem.highlights.length})</h4>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {selectedItem.highlights.map((h, i) => (
                                                        <div key={i} className={`px-3 py-2 rounded-lg ${getHighlightColor(h.type)}`}>
                                                            <p className="text-sm">"{h.text}"</p>
                                                            {h.source && <p className="text-xs mt-1 opacity-70">Source: {h.source}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Comments Section */}
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4 text-purple-400" />
                                                Comments & Suggestions ({selectedItem.comments?.length || 0})
                                            </h4>

                                            {selectedItem.comments?.length > 0 ? (
                                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                                    {selectedItem.comments.map((comment) => (
                                                        <div key={comment._id} className="bg-white/5 rounded-lg p-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-medium text-sm">{comment.userId?.name}</span>
                                                                    {comment.type === 'suggestion' && (
                                                                        <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                                                                            <Lightbulb className="w-3 h-3 inline mr-1" />suggestion
                                                                        </span>
                                                                    )}
                                                                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                                                </div>
                                                                {(user?.id === comment.userId?._id || user?._id === comment.userId?._id) && (
                                                                    <button onClick={() => handleDeleteComment(comment._id)} className="text-gray-500 hover:text-red-400">
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-300">{comment.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 mb-4">No comments yet. Be the first!</p>
                                            )}

                                            {/* Add Comment */}
                                            <div className="flex gap-2">
                                                <select
                                                    value={commentType}
                                                    onChange={(e) => setCommentType(e.target.value)}
                                                    className="bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-sm"
                                                >
                                                    <option value="comment">Comment</option>
                                                    <option value="suggestion">Suggestion</option>
                                                    <option value="feedback">Feedback</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                                    placeholder="Add a comment or suggestion..."
                                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                                />
                                                <button
                                                    onClick={handleAddComment}
                                                    disabled={!newComment.trim() || sending}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SharedHistory;

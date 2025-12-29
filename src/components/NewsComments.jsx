import React, { useState, useEffect } from 'react';
import { newsCommentsAPI } from '../services/blogNewsAPI';
import { Heart, Trash2, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const NewsComments = ({ newsId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Get user from AppContext
    const { user } = useAppContext();
    const isLoggedIn = !!user;
    const currentUser = user;

    useEffect(() => {
        loadComments();
    }, [newsId]);

    const loadComments = async () => {
        try {
            const { data } = await newsCommentsAPI.getComments(newsId);
            console.log('📝 Comments loaded:', data);
            if (data.length > 0) {
                console.log('First comment likes:', data[0].likes);
                console.log('Current user ID:', currentUser?._id);
            }
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error('Please login to comment');
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await newsCommentsAPI.createComment(newsId, newComment);
            setNewComment('');
            toast.success('Comment posted!');
            loadComments();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Delete this comment?')) return;
        try {
            await newsCommentsAPI.deleteComment(commentId);
            toast.success('Comment deleted');
            loadComments();
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleLike = async (commentId) => {
        if (!isLoggedIn) {
            toast.error('Please login to like comments');
            return;
        }
        try {
            await newsCommentsAPI.toggleLike(commentId);
            loadComments();
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const isLiked = (comment) => {
        if (!currentUser) {
            console.log('❌ No current user');
            return false;
        }
        // Compare as strings since MongoDB IDs might be ObjectId or string
        const userId = currentUser._id?.toString() || currentUser._id;
        const liked = comment.likes?.some(likeId => {
            const likeIdStr = likeId.toString();
            console.log('Comparing:', { likeIdStr, userId, match: likeIdStr === userId });
            return likeIdStr === userId;
        }) || false;
        console.log(`💗 isLiked for comment ${comment._id}:`, liked, { userId, likes: comment.likes });
        return liked;
    };

    return (
        <div className="mt-12 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={3}
                        disabled={submitting}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2 transition-all"
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                    <p className="text-gray-400">
                        Please <a href="/login" className="text-cyan-400 hover:underline">login</a> to leave a comment
                    </p>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent mx-auto"></div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {comments.map((comment, idx) => (
                            <motion.div
                                key={comment._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                                        {comment.userName?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-white">{comment.userName}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            
                                            {/* Delete button (only show for comment author) */}
                                            {currentUser && comment.user === currentUser._id && (
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Delete comment"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Comment text */}
                                        <p className="text-gray-300 mb-3 whitespace-pre-wrap break-words">
                                            {comment.comment}
                                        </p>

                                        {/* Like button */}
                                        <button
                                            onClick={() => handleLike(comment._id)}
                                            disabled={!isLoggedIn}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                                                isLiked(comment)
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            } ${!isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <Heart className={`w-4 h-4 ${isLiked(comment) ? 'fill-current' : ''}`} />
                                            <span className="text-sm font-medium">{comment.likeCount || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default NewsComments;

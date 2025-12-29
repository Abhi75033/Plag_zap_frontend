import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/blogNewsAPI';
import { Newspaper, AlertCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import NewsComments from '../components/NewsComments';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const categories = ['All', 'Product Update', 'Feature Release', 'Announcement', 'Maintenance', 'General'];

    useEffect(() => {
        loadNews();
    }, [filter]);

    const loadNews = async () => {
        try {
            const params = filter !== 'All' && filter ? { category: filter } : {};
            const { data } = await newsAPI.getAll(params);
            setNews(data);
        } catch (error) {
            toast.error('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'high') return <AlertCircle className="w-5 h-5 text-red-500" />;
        return null;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'border-blue-500/30',
            medium: 'border-yellow-500/30',
            high: 'border-red-500/30'
        };
        return colors[priority] || '';
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-950">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-full bg-cyan-500/20 mb-6">
                        <Newspaper className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        News & Updates
                    </h1>
                    <p className="text-xl text-gray-400">Latest announcements and updates from PlagZap</p>
                </motion.div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-8 justify-center flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat === 'All' ? '' : cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                (cat === 'All' && !filter) || filter === cat
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading news...</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-16">
                        <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No news available</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`bg-white/5 border ${getPriorityColor(item.priority)} rounded-xl overflow-hidden transition-all`}
                            >
                                {/* News Header - Always Visible */}
                                <div 
                                    className="p-6 hover:bg-white/10 transition-all cursor-pointer"
                                    onClick={() => toggleExpand(item._id)}
                                >
                                    <div className="flex items-start gap-4">
                                        {getPriorityIcon(item.priority)}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <button className="text-gray-400 hover:text-white transition-colors">
                                                    {expandedId === item._id ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-gray-300 mb-3 line-clamp-2">{item.content}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content - Comments Section */}
                                <AnimatePresence>
                                    {expandedId === item._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 border-t border-white/10">
                                                {/* Full Content */}
                                                <div className="pt-6 mb-6">
                                                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                        {item.content}
                                                    </p>
                                                </div>

                                                {/* Comments Section */}
                                                <NewsComments newsId={item._id} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;

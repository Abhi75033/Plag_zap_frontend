import React, { useState, useEffect } from 'react';
import { newsAPI } from '../../services/blogNewsAPI';
import { Newspaper, Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const NewsManager = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [formData, setFormData] = useState({
        title: '', content: '', category: 'General', priority: 'medium', published: true, expiresAt: ''
    });

    const categories = ['Product Update', 'Feature Release', 'Announcement', 'Maintenance', 'General'];
    const priorities = ['low', 'medium', 'high'];

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const { data } = await newsAPI.getAllAdmin();
            setNews(data);
        } catch (error) {
            console.error('Failed to load news - Full error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            toast.error(error.response?.data?.error || 'Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, expiresAt: formData.expiresAt || null };
            if (editingNews) {
                await newsAPI.update(editingNews._id, data);
                toast.success('News updated!');
            } else {
                await newsAPI.create(data);
                toast.success('News created!');
            }
            setShowModal(false);
            setEditingNews(null);
            setFormData({ title: '', content: '', category: 'General', priority: 'medium', published: true, expiresAt: '' });
            loadNews();
        } catch (error) {
            toast.error('Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this news?')) return;
        try {
            await newsAPI.delete(id);
            toast.success('News deleted');
            loadNews();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const openEdit = (item) => {
        setEditingNews(item);
        
        // Fix datetime-local format - if there's an expiration, format it properly
        let expiresAtValue = '';
        if (item.expiresAt) {
            // Create date object and format for datetime-local input (YYYY-MM-DDTHH:mm)
            const date = new Date(item.expiresAt);
            // Use local timezone, not UTC
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            expiresAtValue = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
        
        setFormData({
            title: item.title,
            content: item.content,
            category: item.category,
            priority: item.priority,
            published: item.published,
            expiresAt: expiresAtValue
        });
        setShowModal(true);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-blue-500/20 text-blue-400',
            medium: 'bg-yellow-500/20 text-yellow-400',
            high: 'bg-red-500/20 text-red-400'
        };
        return colors[priority] || colors.medium;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">News Management</h2>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add News
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto" /></div>
            ) : (
                <div className="space-y-3">
                    {news.map(item => (
                        <div key={item._id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-white">{item.title}</h3>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${item.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {item.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-2">{item.content}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>{item.category}</span>
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        {item.expiresAt && <span className="text-yellow-400">Expires: {new Date(item.expiresAt).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(item)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => { setShowModal(false); setEditingNews(null); }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Newspaper className="w-5 h-5 text-cyan-400" />
                                    {editingNews ? 'Edit News' : 'Create News'}
                                </h3>
                                <button onClick={() => { setShowModal(false); setEditingNews(null); }} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Content" required rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                        {categories.map(cat => <option key={cat} value={cat} className="bg-gray-900">{cat}</option>)}
                                    </select>
                                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                        {priorities.map(p => <option key={p} value={p} className="bg-gray-900 capitalize">{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Expiration Date (optional)</label>
                                    <input type="datetime-local" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="w-4 h-4" />
                                    <span className="text-sm text-gray-300">Published</span>
                                </label>
                                <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5" />
                                    {editingNews ? 'Update News' : 'Create News'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NewsManager;

import React, { useState, useEffect } from 'react';
import { blogAPI } from '../../services/blogNewsAPI';
import { FileText, Plus, Edit2, Trash2, Star, Eye, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BlogManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '', excerpt: '', content: '', image: '', category: 'Guides',
        tags: '', published: true, featured: false
    });

    const categories = ['AI & Technology', 'Guides', 'Tips & Tricks', 'Education', 'Product', 'Writing'];

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const { data } = await blogAPI.getAllAdmin();
            setBlogs(data);
        } catch (error) {
            console.error('Failed to load blogs - Full error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            toast.error(error.response?.data?.error || 'Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };
            
            if (editingBlog) {
                await blogAPI.update(editingBlog._id, data);
                toast.success('Blog updated!');
            } else {
                await blogAPI.create(data);
                toast.success('Blog created!');
            }
            
            setShowModal(false);
            setEditingBlog(null);
            setFormData({ title: '', excerpt: '', content: '', image: '', category: 'Guides', tags: '', published: true, featured: false });
            loadBlogs();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save blog');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog?')) return;
        try {
            await blogAPI.delete(id);
            toast.success('Blog deleted');
            loadBlogs();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleToggleFeatured = async (id) => {
        try {
            await blogAPI.toggleFeatured(id);
            loadBlogs();
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const openEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            image: blog.image,
            category: blog.category,
            tags: blog.tags?.join(', ') || '',
            published: blog.published,
            featured: blog.featured
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Blog Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Blog
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" /></div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {blogs.map(blog => (
                        <div key={blog._id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white">{blog.title}</h3>
                                        {blog.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {blog.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2">{blog.excerpt}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span>{blog.category}</span>
                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {blog.views || 0}</span>
                                        <span>{blog.readTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => handleToggleFeatured(blog._id)} className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg" title="Toggle Featured">
                                    <Star className="w-4 h-4" />
                                </button>
                                <button onClick={() => openEdit(blog)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(blog._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => { setShowModal(false); setEditingBlog(null); }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    {editingBlog ? 'Edit Blog' : 'Create Blog'}
                                </h3>
                                <button onClick={() => { setShowModal(false); setEditingBlog(null); }} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Excerpt" required rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Content (Markdown)" required rows={8} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Image URL" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        {categories.map(cat => <option key={cat} value={cat} className="bg-gray-900">{cat}</option>)}
                                    </select>
                                    <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="Tags (comma-separated)" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="w-4 h-4" />
                                        <span className="text-sm text-gray-300">Published</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
                                        <span className="text-sm text-gray-300">Featured</span>
                                    </label>
                                </div>
                                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5" />
                                    {editingBlog ? 'Update Blog' : 'Create Blog'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlogManager;

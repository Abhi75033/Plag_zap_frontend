import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/notificationsAPI';
import { Bell, Send, Users, Sparkles, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const NotificationManager = () => {
    const [templates, setTemplates] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [customMode, setCustomMode] = useState(false);
    const [sending, setSending] = useState(false);
    const [stats, setStats] = useState(null);
    
    const [formData, setFormData] = useState({
        customTitle: '',
        customMessage: '',
        customType: 'custom',
        customIcon: 'bell',
        customLink: ''
    });
    const [targetAudience, setTargetAudience] = useState('all');

    useEffect(() => {
        loadTemplates();
        loadStats();
    }, []);

    const loadTemplates = async () => {
        try {
            const { data } = await notificationsAPI.getTemplates();
            setTemplates(data);
        } catch (error) {
            toast.error('Failed to load templates');
        }
    };

    const loadStats = async () => {
        try {
            const { data } = await notificationsAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleSendToAll = async (e) => {
        e.preventDefault();
        if (!customMode && !selectedTemplate) {
            toast.error('Please select a template');
            return;
        }
        if (customMode && (!formData.customTitle || !formData.customMessage)) {
            toast.error('Title and message are required');
            return;
        }

        if (!confirm('Send this notification to ALL users?')) return;

        setSending(true);
        try {
            const payload = customMode 
                ? { ...formData, targetAudience }
                : { template: selectedTemplate, targetAudience };
            
            const { data } = await notificationsAPI.sendToAll(payload);
            toast.success(data.message);
            setSelectedTemplate('');
            setFormData({
                customTitle: '',
                customMessage: '',
                customType: 'custom',
                customIcon: 'bell',
                customLink: ''
            });
            loadStats();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send notifications');
        } finally {
            setSending(false);
        }
    };

    const templateOptions = Object.keys(templates);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="w-6 h-6 text-cyan-400" />
                    Notification Management
                </h2>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Total Sent</p>
                        <p className="text-2xl font-bold text-white mt-1">{stats.totalSent}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Total Read</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">{stats.totalRead}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Unread</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.totalUnread}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Read Rate</p>
                        <p className="text-2xl font-bold text-cyan-400 mt-1">{stats.readRate}%</p>
                    </div>
                </div>
            )}

            {/* Send Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => setCustomMode(false)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            !customMode
                                ? 'bg-cyan-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Use Template
                    </button>
                    <button
                        onClick={() => setCustomMode(true)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            customMode
                               ? 'bg-cyan-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        Custom Notification
                    </button>
                </div>

                <form onSubmit={handleSendToAll} className="space-y-4">
                    {/* Target Audience Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            📢 Target Audience *
                        </label>
                        <select
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="all" className="bg-gray-900">📣 All Users</option>
                            <option value="free" className="bg-gray-900">🆓 Free Users Only</option>
                            <option value="paid" className="bg-gray-900">💎 Paid Users Only</option>
                            <option value="expiring" className="bg-gray-900">⏰ Plans Expiring (Next 10 Days)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Selected: {targetAudience === 'all' ? 'All Users' : targetAudience === 'free' ? 'Free Users' : targetAudience === 'paid' ? 'Paid Users' : 'Expiring Plans'}
                        </p>
                    </div>

                    {!customMode ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Template
                                </label>
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Choose a template...</option>
                                    {templateOptions.map(key => (
                                        <option key={key} value={key} className="bg-gray-900">
                                            {templates[key].title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedTemplate && templates[selectedTemplate] && (
                                <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                                    <h4 className="font-semibold text-white mb-2">Preview:</h4>
                                    <p className="text-sm text-gray-300 font-medium">{templates[selectedTemplate].title}</p>
                                    <p className="text-sm text-gray-400 mt-1">{templates[selectedTemplate].message}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.customTitle}
                                    onChange={(e) => setFormData({...formData, customTitle: e.target.value})}
                                    placeholder="e.g., New Feature Released!"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    value={formData.customMessage}
                                    onChange={(e) => setFormData({...formData, customMessage: e.target.value})}
                                    placeholder="Your notification message..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                    maxLength={500}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                    <select
                                        value={formData.customType}
                                        onChange={(e) => setFormData({...formData, customType: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="custom" className="bg-gray-900">Custom</option>
                                        <option value="system" className="bg-gray-900">System</option>
                                        <option value="achievement" className="bg-gray-900">Achievement</option>
                                        <option value="subscription" className="bg-gray-900">Subscription</option>
                                        <option value="alert" className="bg-gray-900">Alert</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                                    <select
                                        value={formData.customIcon}
                                        onChange={(e) => setFormData({...formData, customIcon: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="bell" className="bg-gray-900">Bell</option>
                                        <option value="sparkles" className="bg-gray-900">Sparkles</option>
                                        <option value="trophy" className="bg-gray-900">Trophy</option>
                                        <option value="alert-circle" className="bg-gray-900">Alert Circle</option>
                                        <option value="star" className="bg-gray-900">Star</option>
                                        <option value="wrench" className="bg-gray-900">Wrench</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Link (optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.customLink}
                                    onChange={(e) => setFormData({...formData, customLink: e.target.value})}
                                    placeholder="/pricing, /dashboard, etc."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <Users className="w-5 h-5" />
                        {sending ? 'Sending...' : `Send to ${targetAudience === 'all' ? 'All Users' : targetAudience === 'free' ? 'Free Users' : targetAudience === 'paid' ? 'Paid Users' : 'Users with Expiring Plans'}`}
                    </button>

                    <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        This will send the notification to ALL registered users
                    </p>
                </form>
            </div>
        </div>
    );
};

export default NotificationManager;

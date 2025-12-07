import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, deleteUser, getAllFeedbacks, updateFeedbackStatus, deleteFeedback, grantUserSubscription, updateUserSubscriptionStatus, revokeUserSubscription } from '../services/api';
import { Users, DollarSign, Crown, Trash2, ArrowLeft, ArrowRight, MessageSquare, Check, Pause, X, Star, Gift, Play, Ban, XCircle, Ticket, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CouponManager from '../components/admin/CouponManager';
import PromotionalEmailForm from '../components/admin/PromotionalEmailForm';
import PriceManager from '../components/admin/PriceManager';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                <Icon className={`w-5 h-5 text-${color}-500`} />
            </div>
        </div>
        <div className="text-3xl font-bold">{value}</div>
    </div>
);

// Grant Subscription Modal
const GrantSubscriptionModal = ({ user, onClose, onGrant }) => {
    const [tier, setTier] = useState('monthly');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);

    const tierOptions = [
        { value: 'monthly', label: 'Monthly', defaultDays: 30 },
        { value: 'quarterly', label: 'Quarterly (3 months)', defaultDays: 90 },
        { value: 'biannual', label: 'Biannual (6 months)', defaultDays: 180 },
        { value: 'annual', label: 'Annual (1 year)', defaultDays: 365 },
    ];

    const durationOptions = [
        { value: '', label: 'Default (based on tier)' },
        { value: '30', label: '1 Month (30 days)' },
        { value: '90', label: '3 Months (90 days)' },
        { value: '180', label: '6 Months (180 days)' },
        { value: '365', label: '1 Year (365 days)' },
    ];

    const handleGrant = async () => {
        setLoading(true);
        try {
            await onGrant(user._id, { 
                tier, 
                duration: duration ? parseInt(duration) : undefined 
            });
            toast.success(`Granted ${tier} subscription to ${user.name}`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to grant subscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-green-500/20">
                        <Gift className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Grant Free Subscription</h3>
                        <p className="text-sm text-gray-400">to {user.name} ({user.email})</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subscription Tier
                        </label>
                        <select
                            value={tier}
                            onChange={(e) => setTier(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {tierOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-gray-900">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Duration (Override)
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {durationOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-gray-900">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Leave as default to use tier's standard duration</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white/5 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGrant}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <Gift className="w-4 h-4" />
                                Grant Subscription
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Feedback management
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackFilter, setFeedbackFilter] = useState('');
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('users');
    
    // Subscription modal
    const [grantModalUser, setGrantModalUser] = useState(null);

    useEffect(() => {
        loadData();
    }, [currentPage]);

    useEffect(() => {
        if (activeTab === 'feedback') {
            loadFeedbacks();
        }
    }, [activeTab, feedbackFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                getAdminStats(),
                getAdminUsers(currentPage)
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data.users);
            setTotalPages(usersRes.data.totalPages);
        } catch (error) {
            console.error('Failed to load admin data', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const loadFeedbacks = async () => {
        setFeedbackLoading(true);
        try {
            const { data } = await getAllFeedbacks(feedbackFilter);
            setFeedbacks(data.feedbacks || []);
        } catch (error) {
            console.error('Failed to load feedbacks', error);
            toast.error('Failed to load feedbacks');
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        
        try {
            await deleteUser(userId);
            toast.success('User deleted successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleGrantSubscription = async (userId, subscriptionData) => {
        await grantUserSubscription(userId, subscriptionData);
        loadData();
    };

    const handleUpdateStatus = async (userId, status) => {
        try {
            await updateUserSubscriptionStatus(userId, status);
            toast.success(`Subscription ${status}`);
            loadData();
        } catch (error) {
            console.error('Update status error:', error.response?.data || error);
            toast.error(error.response?.data?.error || 'Failed to update subscription status');
        }
    };

    const handleRevokeSubscription = async (userId, userName) => {
        if (!window.confirm(`Revoke ${userName}'s subscription and reset to free tier?`)) return;
        try {
            await revokeUserSubscription(userId);
            toast.success('Subscription revoked');
            loadData();
        } catch (error) {
            toast.error('Failed to revoke subscription');
        }
    };

    const handleUpdateFeedbackStatus = async (feedbackId, status) => {
        try {
            await updateFeedbackStatus(feedbackId, status);
            toast.success(`Feedback ${status}`);
            loadFeedbacks();
        } catch (error) {
            toast.error('Failed to update feedback');
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (!window.confirm('Delete this feedback permanently?')) return;
        try {
            await deleteFeedback(feedbackId);
            toast.success('Feedback deleted');
            loadFeedbacks();
        } catch (error) {
            toast.error('Failed to delete feedback');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            approved: 'bg-green-500/20 text-green-400',
            onhold: 'bg-orange-500/20 text-orange-400',
            rejected: 'bg-red-500/20 text-red-400'
        };
        return styles[status] || 'bg-gray-500/20 text-gray-400';
    };

    const getSubscriptionStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-500/20 text-green-400',
            paused: 'bg-yellow-500/20 text-yellow-400',
            suspended: 'bg-red-500/20 text-red-400'
        };
        return styles[status] || styles.active;
    };

    if (loading && !stats) {
        return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>;
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="blue" />
                <StatCard title="Est. Monthly Revenue" value={`$${stats?.estimatedMRR || 0}`} icon={DollarSign} color="green" />
                <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions || 0} icon={Crown} color="purple" />
                <StatCard title="Free Users" value={stats?.tierStats?.free || 0} icon={Users} color="gray" />
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'feedback' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Feedback
                </button>
                <button
                    onClick={() => setActiveTab('marketing')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'marketing' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                    <Ticket className="w-4 h-4" />
                    Coupons & Emails
                </button>
            </div>

            {activeTab === 'users' ? (
                /* Users Table */
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold">User Management</h2>
                        <span className="text-sm text-gray-400">Page {currentPage} of {totalPages}</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expiry</th>
                                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-white flex items-center gap-2">
                                                    {user.name}
                                                    {user.adminGranted && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400">GIFTED</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.subscriptionTier === 'free' 
                                                    ? 'bg-gray-500/20 text-gray-400' 
                                                    : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {user.subscriptionTier}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {user.subscriptionTier !== 'free' && (
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full capitalize ${getSubscriptionStatusBadge(user.subscriptionStatus)}`}>
                                                    {user.subscriptionStatus || 'active'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-400">
                                            {user.subscriptionExpiry 
                                                ? new Date(user.subscriptionExpiry).toLocaleDateString()
                                                : '-'
                                            }
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* Grant Subscription */}
                                                <button
                                                    onClick={() => setGrantModalUser(user)}
                                                    className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                    title="Grant Subscription"
                                                >
                                                    <Gift className="w-4 h-4" />
                                                </button>

                                                {/* Pause/Resume - Only for paid users */}
                                                {user.subscriptionTier !== 'free' && (
                                                    <>
                                                        {user.subscriptionStatus === 'paused' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user._id, 'active')}
                                                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                                title="Resume Subscription"
                                                            >
                                                                <Play className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user._id, 'paused')}
                                                                className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                                                                title="Pause Subscription"
                                                            >
                                                                <Pause className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        
                                                        {/* Suspend */}
                                                        {user.subscriptionStatus !== 'suspended' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user._id, 'suspended')}
                                                                className="p-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                                                                title="Suspend Subscription"
                                                            >
                                                                <Ban className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Revoke */}
                                                        <button
                                                            onClick={() => handleRevokeSubscription(user._id, user.name)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                            title="Revoke Subscription"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Delete User */}
                                                <button 
                                                    onClick={() => handleDeleteUser(user._id)} 
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors" 
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-white/10 flex justify-center gap-4">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/5 disabled:opacity-50 hover:bg-white/10 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white/5 disabled:opacity-50 hover:bg-white/10 transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                /* Feedback Management */
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold">Feedback Moderation</h2>
                        <div className="flex gap-2 flex-wrap">
                            {['', 'pending', 'approved', 'onhold', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFeedbackFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                                        feedbackFilter === status 
                                            ? 'bg-purple-600 text-white' 
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {status || 'All'}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {feedbackLoading ? (
                        <div className="p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No feedbacks found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {feedbacks.map((feedback) => (
                                <div key={feedback._id} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-bold text-white">{feedback.name}</span>
                                                <span className="text-sm text-gray-500">{feedback.role}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(feedback.status)}`}>
                                                    {feedback.status}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
                                                ))}
                                            </div>
                                            <p className="text-gray-300 text-sm mb-2">"{feedback.message}"</p>
                                            <p className="text-xs text-gray-500">
                                                Submitted: {new Date(feedback.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 items-start">
                                            <button
                                                onClick={() => handleUpdateFeedbackStatus(feedback._id, 'approved')}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    feedback.status === 'approved' 
                                                        ? 'bg-green-500 text-white' 
                                                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                }`}
                                                title="Approve"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateFeedbackStatus(feedback._id, 'onhold')}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    feedback.status === 'onhold' 
                                                        ? 'bg-orange-500 text-white' 
                                                        : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                                                }`}
                                                title="On Hold"
                                            >
                                                <Pause className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateFeedbackStatus(feedback._id, 'rejected')}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    feedback.status === 'rejected' 
                                                        ? 'bg-red-500 text-white' 
                                                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                }`}
                                                title="Reject"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFeedback(feedback._id)}
                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Marketing Tab - Coupons & Promotional Emails */}
            {activeTab === 'marketing' && (
                <div className="space-y-8">
                    <CouponManager />
                    <PriceManager />
                    <PromotionalEmailForm />
                </div>
            )}

            {/* Grant Subscription Modal */}
            <AnimatePresence>
                {grantModalUser && (
                    <GrantSubscriptionModal
                        user={grantModalUser}
                        onClose={() => setGrantModalUser(null)}
                        onGrant={handleGrantSubscription}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

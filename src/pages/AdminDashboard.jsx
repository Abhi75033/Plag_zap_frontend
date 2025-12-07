import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, deleteUser, getAllFeedbacks, updateFeedbackStatus, deleteFeedback } from '../services/api';
import { Users, DollarSign, Crown, Trash2, ArrowLeft, ArrowRight, MessageSquare, Check, Pause, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

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
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'feedback' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Feedback Moderation
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
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${user.subscriptionTier === 'free' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.subscriptionTier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete User">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
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
        </div>
    );
};

export default AdminDashboard;


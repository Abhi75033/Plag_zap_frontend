import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User,
  Crown,
  Zap,
  FileText,
  Calendar,
  Clock,
  ArrowUpRight,
  Shield,
  CreditCard,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Key,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getUsage, getHistory, getApiKeyHistory, revokeApiKey, getGamificationStats, cancelSubscription } from '../services/api';
import WebhooksManager from '../components/ui/WebhooksManager';
import StreakBadges from '../components/ui/StreakBadges';

const Dashboard = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [usage, setUsage] = useState(null);
  const [history, setHistory] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch each data source independently so one failure doesn't break everything
    try {
      const usageRes = await getUsage();
      setUsage(usageRes.data);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }

    try {
      const historyRes = await getHistory();
      setHistory(historyRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }

    try {
      const apiKeyRes = await getApiKeyHistory();
      setApiKeys(apiKeyRes.data.history || []);
    } catch (error) {
      console.error('Failed to fetch API key history:', error);
      // This is expected for users without API keys, so don't show error
    }

    try {
      const gamificationRes = await getGamificationStats();
      setGamification(gamificationRes.data);
    } catch (error) {
      console.error('Failed to fetch gamification:', error);
    }

    setLoading(false);
  };

  const handleRevokeKey = async (keyId) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    try {
      await revokeApiKey(keyId);
      toast.success('API key revoked successfully');
      // Refresh API keys
      const res = await getApiKeyHistory();
      setApiKeys(res.data.history || []);
    } catch (error) {
      toast.error('Failed to revoke API key');
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'pro':
      case 'annual':
        return 'from-purple-500 to-pink-500';
      case 'basic':
      case 'monthly':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'pro':
      case 'annual':
        return <Crown className="h-5 w-5" />;
      case 'basic':
      case 'monthly':
        return <Zap className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'expired':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'revoked':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDaysRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getUsagePercentage = () => {
    if (!usage) return 0;
    const used = usage.usedToday || usage.totalUsed || 0;
    const limit = usage.dailyLimit || usage.totalLimit || 1;
    return Math.min((used / limit) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{user?.name || 'User'}</span>
              </h1>
              <p className="text-gray-400">
                Here's an overview of your plagiarism checking activity
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/analyzer')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
            >
              <Sparkles className="h-5 w-5" />
              New Analysis
            </motion.button>
          </div>
        </motion.div>

        {/* Subscription Status Alert Banner */}
        {user?.subscriptionTier !== 'free' && !user?.hasActiveSubscription && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-400 mb-1">
                  {user?.canPerformAnalysis?.reason === 'SUBSCRIPTION_PAUSED' && '⏸️ Your Subscription is Paused'}
                  {user?.canPerformAnalysis?.reason === 'SUBSCRIPTION_SUSPENDED' && '🚫 Your Subscription is Suspended'}
                  {user?.canPerformAnalysis?.reason === 'SUBSCRIPTION_EXPIRED' && '⌛ Your Subscription has Expired'}
                  {!['SUBSCRIPTION_PAUSED', 'SUBSCRIPTION_SUSPENDED', 'SUBSCRIPTION_EXPIRED'].includes(user?.canPerformAnalysis?.reason) && '⚠️ Your Subscription is On Hold'}
                </h4>
                <p className="text-sm text-gray-300 mb-2">
                  {user?.canPerformAnalysis?.reason === 'SUBSCRIPTION_PAUSED' && 'Your membership is currently paused. Premium features are temporarily unavailable.'}
                  {user?.canPerformAnalysis?.reason === 'SUBSCRIPTION_SUSPENDED' && 'Your membership has been suspended. Please contact support for assistance.'}
                  {user?.canPerformAnalysis?.reason === 'SUBSCRIPTION_EXPIRED' && 'Your subscription has expired. Renew now to continue using premium features.'}
                  {!['SUBSCRIPTION_PAUSED', 'SUBSCRIPTION_SUSPENDED', 'SUBSCRIPTION_EXPIRED'].includes(user?.canPerformAnalysis?.reason) && 'Your membership is on hold. Premium features are temporarily unavailable.'}
                </p>
                <p className="text-xs text-gray-400">
                  For assistance, contact us at: <a href="mailto:abhishekyadav1112.21@gmail.com" className="text-yellow-400 hover:underline">abhishekyadav1112.21@gmail.com</a>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`relative overflow-hidden bg-gradient-to-br ${getTierColor(user?.subscriptionTier)} p-6 rounded-2xl shadow-xl`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                {getTierIcon(user?.subscriptionTier)}
                <span className="text-sm font-medium uppercase tracking-wide opacity-90">
                  Current Plan
                </span>
              </div>
              <h3 className="text-2xl font-bold capitalize mb-1">
                {user?.subscriptionTier || 'Free'} Plan
              </h3>
              {user?.subscriptionExpiry && (
                <p className="text-sm opacity-80">
                  Expires: {formatDate(user.subscriptionExpiry)}
                </p>
              )}
              {user?.subscriptionTier === 'free' && (
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-semibold hover:underline"
                >
                  Upgrade Now <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
              {user?.subscriptionTier !== 'free' && (
                <button
                  onClick={async () => {
                    if (!confirm('Are you sure you want to cancel your subscription? You will be downgraded to the free plan.')) return;
                    try {
                      await cancelSubscription();
                      toast.success('Subscription cancelled. You are now on the free plan.');
                      window.location.reload();
                    } catch (err) {
                      toast.error(err.response?.data?.error || 'Failed to cancel subscription');
                    }
                  }}
                  className="inline-flex items-center gap-1 mt-3 text-xs text-red-300/70 hover:text-red-300 transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </motion.div>

          {/* Usage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">Usage</span>
            </div>
            <div className="mb-3">
              <span className="text-3xl font-bold">
                {usage?.usedToday || usage?.totalUsed || 0}
              </span>
              <span className="text-gray-400">
                {' '}/ {usage?.dailyLimit || usage?.totalLimit || 5}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getUsagePercentage()}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`h-2 rounded-full ${
                  getUsagePercentage() > 80
                    ? 'bg-red-500'
                    : getUsagePercentage() > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              ></motion.div>
            </div>
            <p className="text-xs text-gray-500">
              {user?.subscriptionTier === 'free' ? 'Total' : 'Daily'} limit
            </p>
          </motion.div>

          {/* Total Analyses Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Total Analyses</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{usage?.totalUsed || history.length || 0}</h3>
            <p className="text-sm text-gray-500">Documents checked</p>
          </motion.div>

          {/* Member Since Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Member Since</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {user?.createdAt ? formatDate(user.createdAt) : 'Today'}
            </h3>
            <p className="text-sm text-gray-500">Account created</p>
          </motion.div>
        </div>

        {/* Streaks & Badges Section */}
        {gamification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Your Progress
            </h2>
            <StreakBadges 
              streak={gamification.currentStreak}
              longestStreak={gamification.longestStreak}
              totalAnalyses={gamification.totalAnalyses}
              badges={gamification.badges}
            />
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Recent Activity
              </h2>
              <Link
                to="/history"
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        item.overallScore > 50
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {item.overallScore > 50 ? (
                        <AlertCircle className="h-6 w-6" />
                      ) : (
                        <CheckCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.originalText?.substring(0, 60)}...
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          item.overallScore > 50 ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {item.overallScore}%
                      </p>
                      <p className="text-xs text-gray-500">similarity</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No analyses yet</p>
                <Link
                  to="/analyzer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Start Your First Analysis
                </Link>
              </div>
            )}
          </motion.div>

          {/* Quick Actions & Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-bold">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/analyzer" 
                  className="w-full group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <FileText className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Check Plagiarism</div>
                      <div className="text-xs text-gray-400">Analyze your text</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                </Link>

                <Link 
                  to="/extension" 
                  className="w-full group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <Zap className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Chrome Extension</div>
                      <div className="text-xs text-gray-400">Install for browser</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                </Link>

                <Link 
                  to="/pricing" 
                  className="w-full group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                      <CreditCard className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Manage Subscription</div>
                      <div className="text-xs text-gray-400">Upgrade or renew</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Account Info
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="flex items-center gap-1 text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Plan</span>
                    <span className="capitalize">{user?.subscriptionTier || 'Free'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    toast.success('Logged out successfully');
                    navigate('/');
                  }}
                  className="w-full mt-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* API Key History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Key className="h-5 w-5 text-cyan-400" />
              API Key History
            </h2>
            <Link
              to="/integrations"
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Generate New <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {apiKeys.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                    <th className="pb-3 font-medium">API Key</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium">Expires</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {apiKeys.map((keyEntry, index) => {
                    const daysRemaining = getDaysRemaining(keyEntry.expiresAt);
                    const isExpired = keyEntry.status === 'expired' || daysRemaining <= 0;
                    
                    return (
                      <motion.tr
                        key={keyEntry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="text-sm"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-cyan-400 font-mono bg-white/5 px-2 py-1 rounded">
                              {keyEntry.key}
                            </code>
                            <button
                              onClick={() => handleCopyKey(keyEntry.key)}
                              className="p-1.5 hover:bg-white/10 rounded transition-colors"
                              title="Copy key"
                            >
                              {copied === keyEntry.key ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-gray-400">
                          {formatDateTime(keyEntry.createdAt)}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className={isExpired ? 'text-red-400' : 'text-gray-400'}>
                              {formatDateTime(keyEntry.expiresAt)}
                            </span>
                            {keyEntry.status === 'active' && !isExpired && daysRemaining <= 2 && (
                              <span className="flex items-center gap-1 text-xs text-yellow-400">
                                <AlertTriangle className="h-3 w-3" />
                                {daysRemaining}d left
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusBadge(keyEntry.status)}`}>
                            {keyEntry.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {keyEntry.status === 'active' && (
                            <button
                              onClick={() => handleRevokeKey(keyEntry.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                              title="Revoke key"
                            >
                              <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-400" />
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No API keys generated yet</p>
              <Link
                to="/integrations"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Key className="h-4 w-4" />
                Generate Your First API Key
              </Link>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              API keys expire after 7 days. Generate a new key before expiry to avoid interruptions.
            </p>
          </div>
        </motion.div>

        {/* Upgrade Banner (for free users) */}
        {user?.subscriptionTier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-400" />
                  Upgrade to Pro
                </h3>
                <p className="text-gray-300">
                  Get unlimited daily checks, priority support, and advanced features.
                </p>
              </div>
              <Link
                to="/pricing"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all whitespace-nowrap"
              >
                <Zap className="h-5 w-5" />
                View Plans
              </Link>
            </div>
          </motion.div>
        )}

        {/* Webhooks Section */}
        <div className="mt-8">
            <WebhooksManager />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

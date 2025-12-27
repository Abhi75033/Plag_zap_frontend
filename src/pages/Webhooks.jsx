import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Webhook,
  Plus,
  Trash2,
  ArrowLeft,
  Copy,
  Check,
  X,
  Play,
  AlertCircle,
  Zap,
  Globe,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import webhookAPI from '../services/webhooks';

const WebhooksPage = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', events: ['analysis.completed'] });
  const [copiedSecret, setCopiedSecret] = useState(null);
  const [createdWebhook, setCreatedWebhook] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(null);

  const availableEvents = [
    { id: 'analysis.completed', label: 'Plagiarism Check Completed', desc: 'Triggered when a plagiarism check finishes' }
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const { data } = await webhookAPI.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.url.match(/^https?:\/\/.+/)) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    try {
      const { data } = await webhookAPI.createWebhook(newWebhook);
      setCreatedWebhook(data); // Show secret one time
      setWebhooks([data, ...webhooks]);
      setNewWebhook({ url: '', events: ['analysis.completed'] });
      toast.success('Webhook created successfully!');
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error(error.response?.data?.error || 'Failed to create webhook');
    }
  };

  const handleDeleteWebhook = async (id) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    try {
      await webhookAPI.deleteWebhook(id);
      setWebhooks(webhooks.filter(w => w._id !== id));
      toast.success('Webhook deleted');
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  const handleTestWebhook = async (id) => {
    setTestingWebhook(id);
    try {
      const { data } = await webhookAPI.testWebhook(id);
      toast.success('Ping sent successfully! ✅');
    } catch (error) {
      console.error('Test failed:', error);
      toast.error(error.response?.data?.error || 'Failed to send ping');
    } finally {
      setTestingWebhook(null);
    }
  };

  const copySecret = (secret) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(secret);
    toast.success('Secret copied to clipboard!');
    setTimeout(() => setCopiedSecret(null), 2000);
  };

  const closeCreatedModal = () => {
    setCreatedWebhook(null);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/integrations')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Integrations
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Webhook className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Webhooks
                </h1>
                <p className="text-gray-400">
                  Get real-time notifications when events happen
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Webhook
            </button>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            How Webhooks Work
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Webhooks send HTTP POST requests to your specified URL when events occur. Each request includes a signature for verification.
          </p>
          <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
            X-PlagZap-Signature: sha256=abc123...
          </div>
        </motion.div>

        {/* Webhooks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading webhooks...</p>
            </div>
          ) : webhooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Webhook className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No webhooks yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first webhook to start receiving real-time notifications
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Webhook
              </button>
            </motion.div>
          ) : (
            webhooks.map((webhook, idx) => (
              <motion.div
                key={webhook._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <code className="text-cyan-400 font-mono text-sm">{webhook.url}</code>
                      {webhook.isActive ? (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {webhook.events.map((event) => (
                        <span
                          key={event}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg"
                        >
                          {event}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-500 text-sm">
                      Created {new Date(webhook.createdAt).toLocaleDateString()}
                    </p>

                    {webhook.failureCount > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-yellow-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {webhook.failureCount} failed deliveries
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestWebhook(webhook._id)}
                      disabled={testingWebhook === webhook._id}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Test webhook"
                    >
                      {testingWebhook === webhook._id ? (
                        <RefreshCw className="h-5 w-5 text-cyan-400 animate-spin" />
                      ) : (
                        <Play className="h-5 w-5 text-cyan-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(webhook._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete webhook"
                    >
                      <Trash2 className="h-5 w-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Webhook Modal */}
      <AnimatePresence>
        {showCreateModal && !createdWebhook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Create Webhook
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://your-app.com/webhook"
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Events to Subscribe
                  </label>
                  <div className="space-y-2">
                    {availableEvents.map((event) => (
                      <label
                        key={event.id}
                        className="flex items-start gap-3 p-3 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewWebhook({
                                ...newWebhook,
                                events: [...newWebhook.events, event.id]
                              });
                            } else {
                              setNewWebhook({
                                ...newWebhook,
                                events: newWebhook.events.filter((ev) => ev !== event.id)
                              });
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{event.label}</div>
                          <div className="text-gray-400 text-xs">{event.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateWebhook}
                  disabled={!newWebhook.url || newWebhook.events.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create Webhook
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Webhook Created Modal (Shows Secret) */}
      <AnimatePresence>
        {createdWebhook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Webhook Created! 🎉</h3>
                <p className="text-gray-400 text-sm">
                  Save your secret securely. You won't be able to see it again!
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <p className="text-yellow-400 text-sm font-medium mb-2">⚠️ Important</p>
                <p className="text-gray-300 text-xs">
                  Store this secret in a secure location. Use it to verify webhook signatures.
                </p>
              </div>

              <div className="bg-black/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Webhook Secret</span>
                  <button
                    onClick={() => copySecret(createdWebhook.secret)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copiedSecret === createdWebhook.secret ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <code className="text-cyan-400 font-mono text-sm break-all">
                  {createdWebhook.secret}
                </code>
              </div>

              <button
                onClick={closeCreatedModal}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all"
              >
                I've Saved My Secret
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebhooksPage;

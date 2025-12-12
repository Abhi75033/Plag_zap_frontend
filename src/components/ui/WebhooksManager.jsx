import React, { useState, useEffect } from 'react';
import { getWebhooks, createWebhook, deleteWebhook, testWebhook } from '../../services/api';
import { Trash2, Plus, RefreshCw, Copy, Check, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const WebhooksManager = () => {
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUrl, setNewUrl] = useState('');
    const [adding, setAdding] = useState(false);
    const [testingId, setTestingId] = useState(null);

    useEffect(() => {
        loadWebhooks();
    }, []);

    const loadWebhooks = async () => {
        try {
            const { data } = await getWebhooks();
            setWebhooks(data);
        } catch (error) {
            console.error('Failed to load webhooks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWebhook = async (e) => {
        e.preventDefault();
        if (!newUrl) return;

        setAdding(true);
        try {
            await createWebhook({ url: newUrl });
            toast.success('Webhook added successfully');
            setNewUrl('');
            loadWebhooks();
        } catch (error) {
            toast.error('Failed to add webhook');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this webhook?')) return;
        try {
            await deleteWebhook(id);
            setWebhooks(webhooks.filter(w => w.id !== id));
            toast.success('Webhook deleted');
        } catch (error) {
            toast.error('Failed to delete webhook');
        }
    };

    const handleTest = async (id) => {
        setTestingId(id);
        try {
            await testWebhook(id);
            toast.success('Test ping sent successfully!');
        } catch (error) {
            toast.error('Test failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setTestingId(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Secret copied to clipboard');
    };

    if (loading) return <div className="text-center py-4 text-gray-400">Loading webhooks...</div>;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity className="text-purple-400 w-6 h-6" />
                    <h2 className="text-xl font-bold">Webhooks</h2>
                </div>
                <span className="text-xs text-gray-400">Receive real-time updates</span>
            </div>

            {/* Add New Webhook */}
            <form onSubmit={handleAddWebhook} className="mb-8 flex gap-3">
                <input
                    type="url"
                    placeholder="https://your-api.com/webhook"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    required
                />
                <button
                    type="submit"
                    disabled={adding}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add
                </button>
            </form>

            {/* List Webhooks */}
            <div className="space-y-4">
                {webhooks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-white/5 rounded-xl">
                        No webhooks configured. Add one to get started.
                    </div>
                ) : (
                    webhooks.map((webhook) => (
                        <div key={webhook.id} className="bg-black/20 rounded-xl p-4 border border-white/5 group">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-sm text-gray-300 break-all">{webhook.url}</span>
                                        {webhook.isActive ? (
                                            <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Active</span>
                                        ) : (
                                            <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Inactive</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>Events: {webhook.events.join(', ')}</span>
                                        <span>•</span>
                                        <span>Added {new Date(webhook.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleTest(webhook.id)}
                                        disabled={testingId === webhook.id}
                                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                                        title="Test Webhook"
                                    >
                                        {testingId === webhook.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(webhook.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                        title="Delete Webhook"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Secret Display */}
                            <div className="bg-black/40 rounded-lg p-3 flex items-center justify-between group-hover:bg-black/50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Signing Secret</span>
                                    <code className="text-xs text-gray-400 font-mono">
                                        {webhook.secretMasked || '••••••••••••••••'}
                                    </code>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(webhook.secret || 'Hidden')}
                                    className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                                >
                                    <Copy className="w-3 h-3" />
                                    Copy Secret
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WebhooksManager;

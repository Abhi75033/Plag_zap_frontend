import React, { useState, useEffect } from 'react';
import { Tag, Save, Loader2, Power, PowerOff } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PromoBannerSettings = () => {
    const [settings, setSettings] = useState({
        enabled: false,
        discountPercentage: 50,
        couponCode: 'WELCOME50',
        title: 'Limited Time Offer!',
        description: 'Get started with our premium plans at a special discount',
        expiryDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/admin/promo-settings');
            
            // Format date for input field
            let formattedDate = '';
            if (data.expiryDate) {
                formattedDate = new Date(data.expiryDate).toISOString().split('T')[0];
            }

            setSettings({ ...data, expiryDate: formattedDate });
        } catch (error) {
            console.error('Failed to load promo settings:', error);
            const status = error.response?.status;
            const msg = error.response?.data?.error || error.message;
            const url = error.config?.url;
            const baseURL = error.config?.baseURL || api.defaults.baseURL;
            toast.error(`Load Failed (${status}) at ${baseURL}${url}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/admin/promo-settings', {
                ...settings,
                expiryDate: settings.expiryDate || null // Send null if empty
            });
            toast.success('Promo banner settings updated!');
        } catch (error) {
            console.error('Save settings error:', error);
            const status = error.response?.status;
            const msg = error.response?.data?.error || error.message;
            toast.error(`Save Failed (${status}): ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                        <Tag className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Promotional Banner</h2>
                        <p className="text-sm text-gray-400">Manage popup offer for free users</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${settings.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {settings.enabled ? 'Active' : 'Disabled'}
                </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <div>
                        <h3 className="font-medium text-white">Enable Promotion</h3>
                        <p className="text-sm text-gray-400">Show popup on login/signup for free users</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                        className={`p-3 rounded-lg transition-colors ${
                            settings.enabled 
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                        }`}
                    >
                        {settings.enabled ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Discount Percentage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Discount Percentage (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={settings.discountPercentage}
                            onChange={(e) => setSettings({ ...settings, discountPercentage: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Coupon Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            required
                            value={settings.couponCode}
                            onChange={(e) => setSettings({ ...settings, couponCode: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Modal Title
                        </label>
                        <input
                            type="text"
                            required
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expiry Date (Optional)
                        </label>
                        <input
                            type="date"
                            value={settings.expiryDate}
                            onChange={(e) => setSettings({ ...settings, expiryDate: e.target.value })}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                    </label>
                    <textarea
                        required
                        value={settings.description}
                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromoBannerSettings;

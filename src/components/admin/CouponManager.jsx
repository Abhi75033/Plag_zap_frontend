import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Ticket, Plus, Trash2, Edit, X, Calendar, Percent, Copy, Check, 
    Tag, AlertCircle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from '../../services/api';

const CouponManager = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [copied, setCopied] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        discountPercent: 10,
        description: '',
        expiresAt: '',
        usageLimit: '',
        applicablePlans: [],
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        try {
            setLoading(true);
            const res = await getAdminCoupons();
            setCoupons(res.data);
        } catch (error) {
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
            };

            // DEBUG: Show what we're sending
            console.log('Sending coupon data:', data);
            console.log('applicablePlans in formData:', formData.applicablePlans);
            alert(`Creating coupon with applicablePlans: ${JSON.stringify(formData.applicablePlans)}`);

            if (editingCoupon) {
                await updateAdminCoupon(editingCoupon._id, data);
                toast.success('Coupon updated!');
            } else {
                const response = await createAdminCoupon(data);
                console.log('Create coupon response:', response.data);
                toast.success('Coupon created!');
            }
            setShowModal(false);
            resetForm();
            loadCoupons();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await deleteAdminCoupon(id);
            toast.success('Coupon deleted');
            loadCoupons();
        } catch (error) {
            toast.error('Failed to delete coupon');
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            description: coupon.description || '',
            expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
            usageLimit: coupon.usageLimit || '',
            applicablePlans: coupon.applicablePlans || [],
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountPercent: 10,
            description: '',
            expiresAt: '',
            usageLimit: '',
            applicablePlans: [],
        });
        setEditingCoupon(null);
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        toast.success('Copied!');
        setTimeout(() => setCopied(null), 2000);
    };

    const togglePlan = (plan) => {
        console.log(`Toggle plan clicked: ${plan}`);
        setFormData(prev => {
            const newPlans = prev.applicablePlans.includes(plan)
                ? prev.applicablePlans.filter(p => p !== plan)
                : [...prev.applicablePlans, plan];
            console.log(`Updated applicablePlans: ${JSON.stringify(newPlans)}`);
            return {
                ...prev,
                applicablePlans: newPlans
            };
        });
    };

    const isExpired = (date) => new Date(date) < new Date();

    return (
        <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-purple-400" />
                    Coupon Management
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={loadCoupons}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Create Coupon
                    </button>
                </div>
            </div>

            {/* Coupons Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto" />
                </div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No coupons created yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.map((coupon) => (
                        <motion.div
                            key={coupon._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative p-4 rounded-xl border ${
                                !coupon.isActive || isExpired(coupon.expiresAt)
                                    ? 'bg-gray-900/50 border-gray-700'
                                    : 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30'
                            }`}
                        >
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                {!coupon.isActive ? (
                                    <span className="px-2 py-1 text-xs bg-gray-600 rounded-full">Inactive</span>
                                ) : isExpired(coupon.expiresAt) ? (
                                    <span className="px-2 py-1 text-xs bg-red-600 rounded-full">Expired</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs bg-green-600 rounded-full">Active</span>
                                )}
                            </div>

                            {/* Code */}
                            <div className="flex items-center gap-2 mb-3">
                                <code className="text-lg font-bold text-purple-400">{coupon.code}</code>
                                <button
                                    onClick={() => copyCode(coupon.code)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                >
                                    {copied === coupon.code ? (
                                        <Check className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            {/* Discount */}
                            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-2">
                                <Percent className="h-5 w-5 text-pink-400" />
                                {coupon.discountPercent}% OFF
                            </div>

                            {/* Description */}
                            {coupon.description && (
                                <p className="text-sm text-gray-400 mb-3">{coupon.description}</p>
                            )}

                            {/* Meta Info */}
                            <div className="text-xs text-gray-500 space-y-1 mb-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                                </div>
                                <div>
                                    Used: {coupon.usedCount} / {coupon.usageLimit || '∞'}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(coupon)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                >
                                    <Edit className="h-3 w-3" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm"
                                >
                                    <Trash2 className="h-3 w-3" /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal - Using Portal to render outside component hierarchy */}
            {ReactDOM.createPortal(
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">
                                        {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Code */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Coupon Code</label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="Leave empty to auto-generate"
                                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Discount (%)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={formData.discountPercent}
                                            onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="e.g., Diwali Sale 2024"
                                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                        />
                                    </div>

                                    {/* Expiry */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Expires On</label>
                                        <input
                                            type="date"
                                            value={formData.expiresAt}
                                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                        />
                                    </div>

                                    {/* Usage Limit */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Usage Limit (optional)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                            placeholder="Leave empty for unlimited"
                                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                        />
                                    </div>

                                    {/* Plans */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Applicable Plans</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['monthly', 'quarterly', 'biannual', 'annual'].map((plan) => (
                                                <button
                                                    key={plan}
                                                    type="button"
                                                    onClick={() => togglePlan(plan)}
                                                    className={`px-3 py-1 rounded-full text-sm capitalize ${
                                                        formData.applicablePlans.includes(plan)
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                                >
                                                    {plan}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Leave empty for all plans</p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                                    >
                                        {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default CouponManager;

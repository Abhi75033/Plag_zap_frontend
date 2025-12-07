import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Users, Tag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendPromotionalEmail } from '../../services/api';

const OCCASIONS = [
    { id: 'diwali', name: '🪔 Diwali Sale', subject: '🪔 Diwali Special - Exclusive Discount on PlagZap!', message: 'Celebrate Diwali with us! Get amazing discounts on all our premium plans. Light up your academic success with plagiarism-free content.' },
    { id: 'holi', name: '🎨 Holi Offer', subject: '🎨 Holi Special - Colorful Savings Await!', message: 'Add colors to your academics this Holi! Enjoy special discounts on all premium features.' },
    { id: 'dussehra', name: '🏹 Dussehra Deal', subject: '🏹 Dussehra Special - Victory Over Plagiarism!', message: 'Conquer plagiarism this Dussehra! Special offers on all plans to celebrate the victory of good over evil.' },
    { id: 'newyear', name: '🎉 New Year', subject: '🎉 New Year Sale - Start Fresh with PlagZap!', message: 'New Year, New Goals! Start your academic journey with original content. Exclusive discounts inside!' },
    { id: 'christmas', name: '🎄 Christmas', subject: '🎄 Christmas Special - Ho Ho Ho Savings!', message: 'Santa has a gift for you! Unwrap amazing discounts on PlagZap premium plans this Christmas.' },
    { id: 'custom', name: '✏️ Custom', subject: '', message: '' },
];

const PromotionalEmailForm = () => {
    const [loading, setLoading] = useState(false);
    const [selectedOccasion, setSelectedOccasion] = useState(null);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        ctaText: 'Claim Offer Now',
        ctaUrl: '',
        couponCode: '',
        targetAudience: 'all',
    });

    const handleOccasionSelect = (occasion) => {
        setSelectedOccasion(occasion.id);
        if (occasion.id !== 'custom') {
            setFormData(prev => ({
                ...prev,
                subject: occasion.subject,
                message: occasion.message,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.subject || !formData.message) {
            toast.error('Subject and message are required');
            return;
        }

        if (!confirm(`Send email to ${formData.targetAudience === 'all' ? 'ALL' : formData.targetAudience} users?`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await sendPromotionalEmail(formData);
            toast.success(`Email sent to ${res.data.totalSent} users!`);
            // Reset form
            setFormData({
                subject: '',
                message: '',
                ctaText: 'Claim Offer Now',
                ctaUrl: '',
                couponCode: '',
                targetAudience: 'all',
            });
            setSelectedOccasion(null);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send emails');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Mail className="h-5 w-5 text-pink-400" />
                Promotional Emails
            </h3>

            {/* Occasion Buttons */}
            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Quick Templates</label>
                <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((occasion) => (
                        <button
                            key={occasion.id}
                            type="button"
                            onClick={() => handleOccasionSelect(occasion)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                selectedOccasion === occasion.id
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            {occasion.name}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Subject */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email Subject</label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Enter email subject..."
                        className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                        required
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Enter email message..."
                        rows={4}
                        className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none resize-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CTA Text */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Button Text</label>
                        <input
                            type="text"
                            value={formData.ctaText}
                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                            placeholder="e.g., Claim Offer Now"
                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                        />
                    </div>

                    {/* Coupon Code */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1">
                            <Tag className="h-3 w-3" /> Coupon Code (optional)
                        </label>
                        <input
                            type="text"
                            value={formData.couponCode}
                            onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                            placeholder="e.g., DIWALI50"
                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                        />
                    </div>
                </div>

                {/* Target Audience */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                        <Users className="h-3 w-3" /> Target Audience
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'all', label: 'All Users' },
                            { id: 'free', label: 'Free Users' },
                            { id: 'paid', label: 'Paid Users' },
                            { id: 'expired', label: 'Expired Subscriptions' },
                        ].map((audience) => (
                            <button
                                key={audience.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, targetAudience: audience.id })}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                    formData.targetAudience === audience.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {audience.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            Send Promotional Email
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default PromotionalEmailForm;

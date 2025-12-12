import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Zap, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PromoBanner = ({ showOnPaidUsers = false }) => {
    const [promo, setPromo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if banner was dismissed in this session
        if (sessionStorage.getItem('promoBannerDismissed') === 'true') {
            setDismissed(true);
            setLoading(false);
            return;
        }

        const fetchPromo = async () => {
            try {
                const { data } = await api.get('/promo-settings/active');
                if (data.active) {
                    setPromo(data);
                }
            } catch (error) {
                console.error('Failed to fetch promo settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromo();
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('promoBannerDismissed', 'true');
    };

    const handleSubscribeClick = () => {
        // Store coupon code in sessionStorage so Pricing page can pre-fill it
        if (promo?.couponCode) {
            sessionStorage.setItem('promoCouponCode', promo.couponCode);
        }
        navigate('/pricing');
    };

    // Calculate time remaining if expiry date exists
    const getTimeRemaining = () => {
        if (!promo?.expiryDate) return null;
        const now = new Date();
        const expiry = new Date(promo.expiryDate);
        const diff = expiry - now;
        
        if (diff <= 0) return null;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
        return 'Ending soon';
    };

    // Don't render if loading, dismissed, or no active promo
    if (loading || dismissed || !promo) {
        return null;
    }

    const timeRemaining = getTimeRemaining();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-purple-600/90 rounded-2xl p-4 sm:p-5 shadow-xl border border-purple-500/30">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl" />
                    </div>

                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full transition-colors z-10"
                        aria-label="Dismiss banner"
                    >
                        <X className="w-4 h-4 text-white/80" />
                    </button>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Content */}
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            {/* Icon */}
                            <div className="hidden sm:flex p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Tag className="w-6 h-6 text-white" />
                            </div>

                            {/* Text */}
                            <div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                                    <h3 className="text-lg sm:text-xl font-bold text-white">
                                        {promo.title || 'Limited Time Offer!'}
                                    </h3>
                                    <span className="px-2.5 py-1 bg-yellow-400 text-yellow-900 text-xs sm:text-sm font-bold rounded-full shadow-lg">
                                        {promo.discountPercentage}% OFF
                                    </span>
                                </div>
                                <p className="text-white/80 text-sm mt-1">
                                    {promo.description} • Use code: <span className="font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">{promo.couponCode}</span>
                                </p>
                                {timeRemaining && (
                                    <p className="text-white/70 text-xs mt-1.5 flex items-center gap-1 justify-center sm:justify-start">
                                        <Clock className="w-3 h-3" />
                                        {timeRemaining}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubscribeClick}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                        >
                            <Zap className="w-4 h-4" />
                            Subscribe Now
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PromoBanner;

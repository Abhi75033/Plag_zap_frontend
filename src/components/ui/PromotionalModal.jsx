import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PromotionalModal = ({ isOpen, onClose, promo }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!promo || !promo.active) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.couponCode);
    setCopied(true);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimOffer = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sparkle Effect */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <div className="absolute top-20 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
                <div className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
              </div>

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white mb-2">
                  {promo.title}
                </h2>

                {/* Discount Badge */}
                <div className="inline-block mb-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-5xl px-6 py-3 rounded-xl shadow-lg transform -rotate-2">
                    {promo.discountPercentage}% OFF
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/80 mb-6 text-sm">
                  {promo.description}
                </p>

                {/* Coupon Code */}
                <div className="mb-6">
                  <p className="text-white/60 text-xs mb-2 uppercase tracking-wider">Use Code</p>
                  <div className="flex items-center justify-center gap-2 bg-black/30 rounded-lg p-4 border border-white/20">
                    <code className="text-2xl font-mono font-bold text-white tracking-wider">
                      {promo.couponCode}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleClaimOffer}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg transform hover:scale-105"
                >
                  Claim This Offer Now! 🚀
                </button>

                {/* Expiry Notice */}
                {promo.expiryDate && (
                  <p className="text-white/40 text-xs mt-4">
                    Offer expires on {new Date(promo.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromotionalModal;

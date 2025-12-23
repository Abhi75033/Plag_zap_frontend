import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Check, LogIn, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PROMO_CODE = 'FIRST50';
const DISCOUNT_PERCENT = 50;

const FEATURE_MESSAGES = {
  analyzer: {
    title: 'Unlock Unlimited Analyses',
    description: 'You\'ve used all 5 free analyses. Sign in to continue checking your content for plagiarism and get unlimited access!',
    icon: Sparkles,
    gradient: 'from-purple-600 to-blue-600'
  },
  humanizer: {
    title: 'Unlock AI Humanization',
    description: 'AI Humanization is a premium feature. Sign in to transform AI-generated content into natural, human-like text.',
    icon: Sparkles,
    gradient: 'from-green-600 to-emerald-600'
  },
  writer: {
    title: 'Unlock Premium Writing Features',
    description: 'Get access to advanced AI writing tools, unlimited generation, and more premium features.',
    icon: Crown,
    gradient: 'from-orange-600 to-red-600'
  }
};

const LoginPromptModal = ({ isOpen, onClose, feature = 'analyzer' }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const config = FEATURE_MESSAGES[feature] || FEATURE_MESSAGES.analyzer;
  const Icon = config.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    toast.success('Promo code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  const handleUpgrade = () => {
    onClose();
    // Navigate to pricing with promo code pre-filled (if pricing page supports it)
    navigate('/pricing', { state: { promoCode: PROMO_CODE } });
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-lg bg-gradient-to-br ${config.gradient} backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden`}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Animated Background Effects */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
                <div className="absolute top-20 right-20 w-2 h-2 bg-white/20 rounded-full animate-ping" />
                <div className="absolute bottom-10 left-20 w-2 h-2 bg-white/25 rounded-full animate-pulse" />
                <div className="absolute bottom-20 right-10 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white mb-3">
                  {config.title}
                </h2>

                {/* Description */}
                <p className="text-white/90 mb-6 text-sm leading-relaxed">
                  {config.description}
                </p>

                {/* Promo Code Section */}
                <div className="mb-8 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-white/70 text-xs mb-3 uppercase tracking-wider font-semibold">
                    🎉 Special Offer for New Users
                  </p>
                  
                  <div className="inline-block mb-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-black text-4xl px-6 py-3 rounded-xl shadow-lg transform -rotate-1">
                      {DISCOUNT_PERCENT}% OFF
                    </div>
                  </div>

                  <p className="text-white/60 text-xs mb-3">Use promo code</p>
                  
                  <div className="flex items-center justify-center gap-2 bg-black/30 rounded-xl p-4 border border-white/30">
                    <code className="text-2xl font-mono font-bold text-white tracking-widest">
                      {PROMO_CODE}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Copy promo code"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white/80" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  {/* Primary CTA - Upgrade */}
                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-white hover:bg-white/90 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    Upgrade to Premium
                  </button>

                  {/* Secondary CTA - Sign In */}
                  <button
                    onClick={handleSignIn}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-xl transition-all border border-white/30 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                </div>

                {/* Footer Note */}
                <p className="text-white/50 text-xs mt-6">
                  Already have an account? Sign in to continue using your premium features.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;

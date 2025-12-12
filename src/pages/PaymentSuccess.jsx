import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/analyzer');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-50"></div>
            <CheckCircle className="h-32 w-32 text-green-500 relative" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Your subscription has been activated. Welcome to unlimited access!
          </p>

          <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              What's Next?
            </h2>
            <ul className="text-left space-y-3 max-w-md mx-auto text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Unlimited plagiarism checks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Unlimited AI text rewriting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Full access to history and analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Start Analyzing
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background/50 border border-white/20 hover:border-white/40 text-white font-bold rounded-xl transition-all"
            >
              View My Plan
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Redirecting to Analyzer in 5 seconds...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

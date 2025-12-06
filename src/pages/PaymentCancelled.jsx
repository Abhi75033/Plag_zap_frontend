import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

const PaymentCancelled = () => {
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
            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-50"></div>
            <XCircle className="h-32 w-32 text-orange-500 relative" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            No worries! Your payment was not processed.
          </p>

          <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">What happened?</h2>
            <p className="text-gray-300 mb-6">
              It looks like you cancelled the payment or closed the checkout window. 
              Your account remains on the free tier with no charges.
            </p>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-400">
                💡 <strong>Tip:</strong> You can upgrade anytime to unlock unlimited features!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              <CreditCard className="h-5 w-5" />
              Try Again
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background/50 border border-white/20 hover:border-white/40 text-white font-bold rounded-xl transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
          </div>

          <div className="mt-12 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-3">Still have questions?</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Need help choosing a plan? Check our <Link to="/pricing" className="text-blue-400 hover:text-blue-300">pricing page</Link></li>
              <li>• Continue using the free tier (5 analyses)</li>
              <li>• Contact support if you experienced an issue</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancelled;

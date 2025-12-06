import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, Globe, CheckCircle, Info } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-full bg-blue-500/20 mb-6">
            <Package className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Shipping Policy</h1>
          <p className="text-gray-400">Last updated: December 5, 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Digital Product Notice */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Digital Product - No Physical Shipping</h2>
                <p className="text-gray-400">
                  PlagZap is a <strong className="text-white">100% digital service</strong>. We do not ship any physical 
                  products. All our services are delivered online through our web platform instantly upon purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              Service Delivery
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white">Instant Activation</h3>
                  <p className="text-sm text-gray-400">Your subscription is activated immediately upon successful payment.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white">24/7 Access</h3>
                  <p className="text-sm text-gray-400">Access our plagiarism detection and AI humanization tools anytime, anywhere.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white">Email Confirmation</h3>
                  <p className="text-sm text-gray-400">A confirmation email with your subscription details is sent within minutes of purchase.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Access Information */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              How to Access Your Subscription
            </h2>
            <ol className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">1</span>
                <span>Complete your payment through our secure Razorpay checkout.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">2</span>
                <span>You will be automatically redirected to the success page.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                <span>Your account is upgraded instantly - start using PlagZap immediately!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">4</span>
                <span>Check your email for the payment confirmation and receipt.</span>
              </li>
            </ol>
          </div>

          {/* Technical Requirements */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Technical Requirements</h2>
            <p className="text-gray-400 mb-4">
              To use PlagZap services, you need:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li>• A modern web browser (Chrome, Firefox, Safari, Edge)</li>
              <li>• Stable internet connection</li>
              <li>• A valid email address for account registration</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Questions?</h2>
            <p className="text-gray-400">
              If you have any questions about service delivery, please contact us at:{' '}
              <a href="mailto:support@plagzap.com" className="text-blue-400 hover:underline">
                support@plagzap.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shipping;

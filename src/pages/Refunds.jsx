import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Mail } from 'lucide-react';

const Refunds = () => {
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-full bg-orange-500/20 mb-6">
            <RotateCcw className="h-8 w-8 text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Cancellation & Refund Policy</h1>
          <p className="text-gray-400">Last updated: December 5, 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Money Back Guarantee */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">7-Day Money-Back Guarantee</h2>
                <p className="text-gray-400">
                  We offer a <strong className="text-white">full refund within 7 days</strong> of your purchase 
                  if you are not satisfied with our services. No questions asked!
                </p>
              </div>
            </div>
          </div>

          {/* Refund Eligibility */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Eligible for Refund
            </h2>
            <ul className="space-y-3">
              {[
                'Refund requested within 7 days of purchase',
                'First-time subscribers only',
                'Technical issues preventing service use (verified by our team)',
                'Accidental duplicate payments',
                'Unauthorized transactions (with valid proof)',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Non-Refundable */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Not Eligible for Refund
            </h2>
            <ul className="space-y-3">
              {[
                'Refund requested after 7 days of purchase',
                'User has consumed more than 50% of their daily/total usage limit',
                'Violation of our Terms of Service',
                'Change of mind after extensive use of the service',
                'Third-party issues (browser, internet connection, etc.)',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-400">
                  <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Subscription Cancellation
            </h2>
            <div className="space-y-4 text-gray-400">
              <p>
                <strong className="text-white">1. How to Cancel:</strong> You can cancel your subscription 
                at any time by contacting our support team at support@plagzap.com.
              </p>
              <p>
                <strong className="text-white">2. Effect of Cancellation:</strong> Your subscription will 
                remain active until the end of your current billing period. After that, your account will 
                revert to the free tier.
              </p>
              <p>
                <strong className="text-white">3. No Partial Refunds:</strong> We do not offer refunds for 
                unused time on subscriptions that are cancelled mid-cycle (outside the 7-day window).
              </p>
              <p>
                <strong className="text-white">4. Data Retention:</strong> Your analysis history will be 
                retained for 30 days after cancellation, after which it may be deleted.
              </p>
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Refund Process
            </h2>
            <ol className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium text-white">Submit Request</p>
                  <p className="text-sm">Email us at support@plagzap.com with your registered email and reason for refund.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-medium text-white">Review (24-48 hours)</p>
                  <p className="text-sm">Our team will review your request and verify eligibility.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-medium text-white">Processing (3-5 business days)</p>
                  <p className="text-sm">Once approved, refund will be initiated to your original payment method.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-medium text-white">Confirmation</p>
                  <p className="text-sm">You'll receive an email confirmation once the refund is processed.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Contact for Refunds */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Request a Refund</h2>
                <p className="text-gray-400 mb-4">
                  To request a refund or cancellation, please email us with:
                </p>
                <ul className="text-sm text-gray-400 space-y-1 mb-4">
                  <li>• Your registered email address</li>
                  <li>• Razorpay Payment ID (from your receipt)</li>
                  <li>• Reason for refund request</li>
                </ul>
                <a
                  href="mailto:support@plagzap.com?subject=Refund Request"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Refunds;

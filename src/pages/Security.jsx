import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Server, Eye, Key, CheckCircle } from 'lucide-react';

const Security = () => {
  const features = [
    { icon: <Lock />, title: 'End-to-End Encryption', desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256.' },
    { icon: <Shield />, title: 'SOC 2 Compliance', desc: 'We follow industry-standard security practices and undergo regular audits.' },
    { icon: <Server />, title: 'Secure Infrastructure', desc: 'Our servers are hosted on enterprise-grade cloud infrastructure with 99.9% uptime.' },
    { icon: <Eye />, title: 'No Data Retention', desc: 'Your content is processed in real-time and not stored permanently on our servers.' },
    { icon: <Key />, title: 'Password Security', desc: 'All passwords are hashed using bcrypt with salt, making them impossible to reverse.' },
    { icon: <CheckCircle />, title: 'PCI Compliant', desc: 'Payment processing is handled by Stripe, which is PCI DSS Level 1 certified.' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-4 rounded-full bg-green-500/20 mb-6">
            <Shield className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Security
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your security is our top priority. Learn about the measures we take to protect your data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-background/50 border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-all"
            >
              <div className="inline-flex p-3 rounded-xl bg-green-500/20 text-green-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-background/50 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Report a Vulnerability</h2>
          <p className="text-gray-400 mb-4">
            If you discover a security vulnerability, please report it to us responsibly. We have a bug bounty program 
            and appreciate security researchers who help us keep our platform safe.
          </p>
          <p className="text-gray-400">
            Contact us at: <a href="mailto:security@plagzap.com" className="text-green-400 hover:underline">security@plagzap.com</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Security;

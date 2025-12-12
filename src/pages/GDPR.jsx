import React from 'react';
import { motion } from 'framer-motion';
import { Globe, CheckCircle } from 'lucide-react';

const GDPR = () => {
  const rights = [
    { title: 'Right to Access', desc: 'You can request a copy of all personal data we hold about you.' },
    { title: 'Right to Rectification', desc: 'You can request correction of inaccurate personal data.' },
    { title: 'Right to Erasure', desc: 'You can request deletion of your personal data ("right to be forgotten").' },
    { title: 'Right to Portability', desc: 'You can request your data in a machine-readable format.' },
    { title: 'Right to Object', desc: 'You can object to processing of your personal data for marketing.' },
    { title: 'Right to Restrict', desc: 'You can request restriction of processing in certain circumstances.' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-full bg-blue-500/20 mb-6">
            <Globe className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">GDPR Compliance</h1>
          <p className="text-gray-400">How we comply with the General Data Protection Regulation</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Our Commitment to GDPR</h2>
            <p className="text-gray-400 leading-relaxed">
              PlagZap is fully committed to GDPR compliance. We process personal data lawfully, fairly, and 
              transparently. We collect only the minimum data necessary to provide our services and ensure 
              that your data is kept secure at all times.
            </p>
          </div>

          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Your Rights Under GDPR</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {rights.map((right, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">{right.title}</h3>
                    <p className="text-sm text-gray-400">{right.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Data Processing</h2>
            <ul className="space-y-3 text-gray-400">
              <li>• <strong className="text-white">Legal Basis:</strong> We process data based on consent and contractual necessity</li>
              <li>• <strong className="text-white">Data Minimization:</strong> We only collect data essential for our services</li>
              <li>• <strong className="text-white">Storage Limitation:</strong> Data is retained only as long as necessary</li>
              <li>• <strong className="text-white">Integrity:</strong> We implement appropriate security measures</li>
            </ul>
          </div>

          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Exercise Your Rights</h2>
            <p className="text-gray-400 mb-4">
              To exercise any of your GDPR rights, please contact our Data Protection Officer:
            </p>
            <p className="text-blue-400">dpo@plagzap.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GDPR;

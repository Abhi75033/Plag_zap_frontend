import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes:
      • Account information (name, email, password)
      • Payment information (processed securely via Stripe)
      • Content you submit for analysis
      • Usage data and analytics`
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      • Provide, maintain, and improve our services
      • Process transactions and send related information
      • Send you technical notices and support messages
      • Respond to your comments and questions
      • Analyze usage patterns to improve user experience`
    },
    {
      title: 'Data Security',
      content: `We implement industry-standard security measures to protect your data:
      • All data is encrypted in transit using TLS/SSL
      • Passwords are hashed using bcrypt encryption
      • Payment data is handled securely by Stripe (PCI compliant)
      • Regular security audits and vulnerability assessments`
    },
    {
      title: 'Content Processing',
      content: `When you submit content for plagiarism detection or humanization:
      • Content is processed in real-time and not permanently stored
      • We do not use your content to train AI models
      • Analysis results are stored only in your account history
      • You can delete your history at any time`
    },
    {
      title: 'Third-Party Services',
      content: `We use trusted third-party services:
      • Google Gemini API for AI processing
      • Stripe for payment processing
      • MongoDB Atlas for secure data storage
      These services have their own privacy policies and comply with industry standards.`
    },
    {
      title: 'Your Rights',
      content: `You have the right to:
      • Access your personal data
      • Correct inaccurate data
      • Delete your account and associated data
      • Export your data
      • Opt-out of marketing communications`
    },
    {
      title: 'Contact Us',
      content: `If you have questions about this Privacy Policy, please contact us at privacy@plagzap.com`
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-full bg-purple-500/20 mb-6">
            <Shield className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: December 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-300 leading-relaxed">
              At PlagZap, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our plagiarism detection and 
              text humanization services.
            </p>
          </div>

          {sections.map((section, idx) => (
            <div key={idx} className="bg-background/50 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
              <p className="text-gray-400 whitespace-pre-line leading-relaxed">{section.content}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;

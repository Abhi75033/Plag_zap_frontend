import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using PlagZap, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`
    },
    {
      title: '2. Description of Service',
      content: `PlagZap provides AI-powered plagiarism detection and text humanization services. Our platform uses advanced algorithms to analyze content for originality and can transform AI-generated text into more natural, human-like writing.`
    },
    {
      title: '3. User Accounts',
      content: `• You must provide accurate and complete information when creating an account
      • You are responsible for maintaining the security of your account credentials
      • You must notify us immediately of any unauthorized access
      • One person or entity may not maintain multiple free accounts`
    },
    {
      title: '4. Acceptable Use',
      content: `You agree NOT to:
      • Use the service for any illegal purposes
      • Submit content that infringes on intellectual property rights
      • Attempt to reverse engineer or hack our systems
      • Resell or redistribute our services without authorization
      • Use automated tools to abuse our API or services`
    },
    {
      title: '5. Subscription and Payments',
      content: `• Paid subscriptions are billed in advance on a recurring basis
      • You can cancel your subscription at any time
      • Refunds are available within 7 days of purchase
      • We reserve the right to change pricing with 30 days notice
      • Failed payments may result in service suspension`
    },
    {
      title: '6. Intellectual Property',
      content: `• You retain all rights to content you submit
      • We do not claim ownership of your analyzed content
      • PlagZap and its branding are our intellectual property
      • You may not copy or replicate our service`
    },
    {
      title: '7. Limitation of Liability',
      content: `PlagZap is provided "as is" without warranties. We are not liable for:
      • Accuracy of plagiarism detection results
      • Any damages arising from use of our service
      • Third-party content or services
      Maximum liability is limited to the amount paid for services.`
    },
    {
      title: '8. Termination',
      content: `We reserve the right to terminate or suspend accounts that violate these terms. Upon termination, your right to use the service ceases immediately.`
    },
    {
      title: '9. Changes to Terms',
      content: `We may update these terms from time to time. We will notify users of significant changes via email or through the service. Continued use after changes constitutes acceptance.`
    },
    {
      title: '10. Contact',
      content: `For questions about these Terms, please contact us at legal@plagzap.com`
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
          <div className="inline-flex p-4 rounded-full bg-blue-500/20 mb-6">
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
          <p className="text-gray-400">Last updated: December 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
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

export default Terms;

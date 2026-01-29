import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Clock, CheckCircle, Globe, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const PlagiarismCheckerOnline = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Clock className="h-6 w-6" />, title: 'Instant Results', desc: 'Get plagiarism reports in under 10 seconds' },
    { icon: <Globe className="h-6 w-6" />, title: 'Billions of Sources', desc: 'Check against 50B+ web pages and academic papers' },
    { icon: <Shield className="h-6 w-6" />, title: '100% Secure', desc: 'Your documents are never stored or shared' },
    { icon: <Sparkles className="h-6 w-6" />, title: 'AI Detection', desc: 'Detect ChatGPT, Claude, and other AI-generated content' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="Plagzap — Fast Online Plagiarism Checker | Free Instant Report"
        description="Check for plagiarism online with Plagzap. Fast, accurate, and free plagiarism detection. Scan your documents against billions of sources instantly. No registration required."
        keywords="plagiarism checker online, online plagiarism checker, check plagiarism online, plagiarism detector online, free online plagiarism checker"
        canonical="/plagiarism-checker-online"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Online Plagiarism Checker",
          "description": "Fast and accurate online plagiarism checking tool",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://plagzap.xyz/" },
              { "@type": "ListItem", "position": 2, "name": "Online Plagiarism Checker", "item": "https://plagzap.xyz/plagiarism-checker-online" }
            ]
          }
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Online Plagiarism Checker
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Check for plagiarism online instantly with PlagZap. Our advanced AI-powered tool scans billions of sources to ensure your content is 100% original.
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            <Zap className="inline h-5 w-5 mr-2" />
            Check Plagiarism Now - Free
          </button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all"
            >
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How Our Online Plagiarism Checker Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload or Paste', desc: 'Copy your text or upload a document (PDF, DOC, TXT)' },
              { step: '2', title: 'Instant Scan', desc: 'Our AI scans billions of web pages and academic sources' },
              { step: '3', title: 'Get Report', desc: 'Receive a detailed plagiarism report with matched sources' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold text-purple-500/30 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 md:p-12 mb-16 border border-white/10">
          <h2 className="text-3xl font-bold mb-6">Why Choose PlagZap's Online Checker?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Check unlimited documents online',
              'No software installation required',
              'Works on any device with internet',
              'Supports 30+ file formats',
              'Detailed similarity reports',
              'AI content detection included'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold mb-6">Ready to Check Your Content?</h2>
          <p className="text-gray-400 mb-8">Start using our online plagiarism checker now - completely free!</p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl"
          >
            Start Checking Online
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlagiarismCheckerOnline;

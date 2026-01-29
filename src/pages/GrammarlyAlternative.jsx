import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, X, Shield, Zap, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const GrammarlyAlternative = () => {
  const navigate = useNavigate();

  const comparisonData = [
    { feature: 'Plagiarism Checking', grammarly: 'Premium only', plagzap: 'Free tier available' },
    { feature: 'AI Content Detection', grammarly: 'Limited', plagzap: 'Advanced (98.4% Accuracy)' },
    { feature: 'Deep Web Scan', grammarly: 'Yes', plagzap: 'Yes (50B+ Sources)' },
    { feature: 'Cost (Monthly)', grammarly: '$30.00', plagzap: '$9.99' },
    { feature: 'Word Count Limit', grammarly: 'Limited on some plans', plagzap: 'Unlimited Premium' },
    { feature: 'API Access', grammarly: 'Business only', plagzap: 'Available for developers' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="Grammarly Alternative — Better Plagiarism & AI Checker | Plagzap"
        description="Looking for a better, more affordable Grammarly alternative for plagiarism checking? PlagZap offers superior AI detection and deep scanning at a fraction of the cost."
        keywords="grammarly alternative, grammarly vs plagzap, free grammarly alternative, plagiarism checker compared, best grammarly competitor"
        canonical="/grammarly-alternative"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Grammarly Alternative Comparison",
          "description": "Compare PlagZap vs Grammarly for plagiarism and AI detection"
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            The Smart <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Grammarly Alternative</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Stop overpaying for basic checking. PlagZap combines deep plagiarism scanning with the industry's most advanced AI content detection—for 70% less.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/analyzer')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Check Plagiarism Free
            </button>
          </div>
        </motion.div>

        {/* Head-to-Head */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Head-to-Head Comparison</h2>
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-3 bg-gray-800/80 p-6 font-bold text-lg border-b border-white/10">
                <div className="text-gray-300">Feature</div>
                <div className="text-center text-gray-400">Grammarly</div>
                <div className="text-center text-green-400 flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5 fill-current" /> PlagZap
                </div>
              </div>
              {comparisonData.map((row, idx) => (
                <div key={idx} className={`grid grid-cols-3 p-6 border-b border-white/5 items-center hover:bg-white/5 transition-colors ${idx === comparisonData.length - 1 ? 'border-none' : ''}`}>
                  <div className="font-medium text-gray-300">{row.feature}</div>
                  <div className="text-center text-gray-500 font-medium">{row.grammarly}</div>
                  <div className="text-center text-green-400 font-bold text-lg">{row.plagzap}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Why Switch */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-900/40 p-8 rounded-2xl border border-white/10">
            <Shield className="h-10 w-10 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Better Plagiarism Depth</h3>
            <p className="text-gray-400">
                Grammarly is great for grammar, but PlagZap is built for originality. We scan more academic sources and difficult-to-track databases.
            </p>
          </div>
          <div className="bg-gray-900/40 p-8 rounded-2xl border border-white/10">
            <Sparkles className="h-10 w-10 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Superior AI Detection</h3>
            <p className="text-gray-400">
                Modern writing needs AI checking. PlagZap's specialized models detect ChatGPT, Claude, and Gemini with higher accuracy than generalist tools.
            </p>
          </div>
          <div className="bg-gray-900/40 p-8 rounded-2xl border border-white/10">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-500/20 text-green-400 mb-4 font-bold text-xl">$</div>
            <h3 className="text-2xl font-bold mb-3">Fair Pricing</h3>
            <p className="text-gray-400">
                Why pay $30/month? Get better detection for just $9.99/month. Perfect for students and freelancers budgeting smart.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16 bg-gradient-to-b from-transparent to-green-900/20 rounded-3xl">
          <h2 className="text-4xl font-bold mb-6">Make the Smart Switch</h2>
          <p className="text-gray-400 mb-8 text-lg">Join users who moved to PlagZap for better accuracy and value.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl"
          >
            Switch to PlagZap
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GrammarlyAlternative;

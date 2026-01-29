import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Zap, Shield, Star, CheckCircle, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const FreePlagiarismChecker = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="Free Plagiarism Checker — Check 2,000 Words Free | Plagzap"
        description="Use PlagZap's free plagiarism checker to scan up to 2,000 words at once. No credit card required. Accurate AI-powered plagiarism detection for students and writers."
        keywords="plagiarism checker free, free plagiarism checker, free plagiarism detector, check plagiarism free, plagiarism checker free online"
        canonical="/free-plagiarism-checker"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Free Plagiarism Checker",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "10000"
          }
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6">
            <Gift className="h-4 w-4" />
            100% Free Forever
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Free Plagiarism Checker
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Check up to 2,000 words for plagiarism completely free. No credit card, no registration required. Get instant, accurate results powered by AI.
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            <Zap className="inline h-5 w-5 mr-2" />
            Start Free Check Now
          </button>
        </motion.div>

        {/* Free Features */}
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl p-8 md:p-12 mb-16 border border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-center">What's Included in the Free Plan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <CheckCircle className="h-6 w-6 text-green-400" />, text: 'Check up to 2,000 words per scan' },
              { icon: <Shield className="h-6 w-6 text-blue-400" />, text: 'Scan against billions of web pages' },
              { icon: <Star className="h-6 w-6 text-yellow-400" />, text: 'AI content detection included' },
              { icon: <TrendingUp className="h-6 w-6 text-purple-400" />, text: 'Detailed similarity reports' },
              { icon: <Zap className="h-6 w-6 text-cyan-400" />, text: 'Instant results in seconds' },
              { icon: <Gift className="h-6 w-6 text-pink-400" />, text: 'No credit card required' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 bg-black/40 p-4 rounded-xl"
              >
                {item.icon}
                <span className="text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Free vs Premium</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <div className="text-4xl font-bold text-green-400">$0</div>
                <p className="text-gray-400 text-sm">Forever</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">2,000 words per check</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Basic plagiarism detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">AI content detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Standard support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/analyzer')}
                className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors"
              >
                Start Free
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold text-purple-400">$9.99</div>
                <p className="text-gray-400 text-sm">per month</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Unlimited word count</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Advanced AI detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Bulk document checking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">API access</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'Is the free plagiarism checker really free?',
                a: 'Yes! Our free plan allows you to check up to 2,000 words per scan with no credit card required. You can use it as many times as you want.'
              },
              {
                q: 'Do I need to create an account?',
                a: 'No account needed for the free checker. Simply paste your text and click check. However, creating a free account lets you save your history.'
              },
              {
                q: 'How accurate is the free version?',
                a: 'The free version uses the same AI-powered detection engine as our premium plans, ensuring high accuracy for plagiarism and AI content detection.'
              },
              {
                q: 'What happens if my document is longer than 2,000 words?',
                a: 'You can either check it in sections or upgrade to our premium plan for unlimited word count checking.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold mb-6">Start Checking for Free Today</h2>
          <p className="text-gray-400 mb-8">No credit card. No registration. Just paste and check.</p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl"
          >
            Check Plagiarism Free
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FreePlagiarismChecker;

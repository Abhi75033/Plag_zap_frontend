import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Shield, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const AIPlagiarismChecker = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="AI Plagiarism Checker — Detect ChatGPT & AI Content | Plagzap"
        description="Best AI plagiarism checker 2026. Detect ChatGPT, Claude, Gemini, and other AI-generated content with 98.4% accuracy. Advanced AI detection technology."
        keywords="ai plagiarism checker, best plagiarism checker 2026, chatgpt detector, ai content detector, ai writing detector, detect ai text"
        canonical="/ai-plagiarism-checker"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Plagiarism Checker",
          "applicationCategory": "EducationalApplication",
          "description": "Advanced AI-powered plagiarism and AI content detection tool",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            Powered by Advanced AI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AI Plagiarism Checker
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            The most advanced AI plagiarism checker of 2026. Detect content from ChatGPT, Claude, Gemini, and other AI models with industry-leading 98.4% accuracy.
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            <Zap className="inline h-5 w-5 mr-2" />
            Check for AI Content Now
          </button>
        </motion.div>

        {/* What We Detect */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">AI Models We Detect</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'ChatGPT', versions: 'GPT-3.5, GPT-4, GPT-4o', icon: '🤖' },
              { name: 'Claude', versions: 'Claude 2, Claude 3', icon: '🧠' },
              { name: 'Gemini', versions: 'Gemini Pro, Ultra', icon: '✨' },
              { name: 'Other AI', versions: 'Bard, Jasper, Copy.ai', icon: '🔮' }
            ].map((ai, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6 text-center hover:border-purple-500/60 transition-all"
              >
                <div className="text-4xl mb-3">{ai.icon}</div>
                <h3 className="text-xl font-bold mb-2">{ai.name}</h3>
                <p className="text-sm text-gray-400">{ai.versions}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 md:p-12 mb-16 border border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-center">How Our AI Detection Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="h-8 w-8" />,
                title: 'Pattern Analysis',
                desc: 'Analyzes sentence structure, word choice, and writing patterns unique to AI models'
              },
              {
                icon: <Brain className="h-8 w-8" />,
                title: 'Perplexity Scoring',
                desc: 'Measures text predictability - AI text has lower perplexity than human writing'
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Burstiness Detection',
                desc: 'Identifies uniform sentence patterns typical of AI-generated content'
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex p-4 rounded-xl bg-purple-500/20 text-purple-400 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why PlagZap is the Best AI Checker</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <CheckCircle className="h-6 w-6 text-green-400" />,
                title: '98.4% Accuracy Rate',
                desc: 'Industry-leading accuracy in detecting AI-generated content'
              },
              {
                icon: <Zap className="h-6 w-6 text-yellow-400" />,
                title: 'Instant Results',
                desc: 'Get AI detection results in under 3 seconds'
              },
              {
                icon: <Brain className="h-6 w-6 text-purple-400" />,
                title: 'Multi-Model Detection',
                desc: 'Detects content from all major AI writing tools'
              },
              {
                icon: <Shield className="h-6 w-6 text-blue-400" />,
                title: 'Sentence-Level Analysis',
                desc: 'See exactly which sentences are AI-generated'
              },
              {
                icon: <AlertTriangle className="h-6 w-6 text-orange-400" />,
                title: 'Paraphrase Detection',
                desc: 'Catches AI content even when paraphrased or rewritten'
              },
              {
                icon: <Cpu className="h-6 w-6 text-cyan-400" />,
                title: 'Continuous Updates',
                desc: 'Our models are updated monthly to detect new AI tools'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 bg-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Who Uses Our AI Checker?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Educators',
                desc: 'Verify student submissions aren\'t AI-generated',
                stats: '5,000+ teachers'
              },
              {
                title: 'Content Managers',
                desc: 'Ensure freelance writers deliver human content',
                stats: '2,000+ agencies'
              },
              {
                title: 'Students',
                desc: 'Check their work before submission to avoid issues',
                stats: '3,000+ students'
              }
            ].map((useCase, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-400 mb-4">{useCase.desc}</p>
                <div className="text-purple-400 font-semibold">{useCase.stats}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'How accurate is AI detection?',
                a: 'Our AI detection achieves 98.4% accuracy by analyzing multiple factors including perplexity, burstiness, and pattern matching against known AI models.'
              },
              {
                q: 'Can it detect paraphrased AI content?',
                a: 'Yes! Our advanced algorithms can detect AI content even when it has been paraphrased or rewritten using tools like QuillBot or Wordtune.'
              },
              {
                q: 'Which AI models can you detect?',
                a: 'We detect ChatGPT (all versions), Claude, Gemini, Bard, Jasper, Copy.ai, and most other AI writing tools. Our models are updated monthly.'
              },
              {
                q: 'Will it flag human writing as AI?',
                a: 'False positives are rare (less than 2%). Our system is trained on millions of human and AI texts to distinguish between them accurately.'
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
          <h2 className="text-4xl font-bold mb-6">Detect AI Content in Seconds</h2>
          <p className="text-gray-400 mb-8">Try the best AI plagiarism checker of 2026</p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl"
          >
            Check for AI Now - Free
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIPlagiarismChecker;

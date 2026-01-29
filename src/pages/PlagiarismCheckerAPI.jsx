import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Zap, Shield, CheckCircle, Book, Terminal } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const PlagiarismCheckerAPI = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="Plagzap API — Integrate Plagiarism Detection into Your App"
        description="Integrate PlagZap's plagiarism detection API into your application. RESTful API for developers with comprehensive documentation. Check plagiarism programmatically."
        keywords="plagiarism checker API, plagiarism API for developers, plagiarism detection API, content checking API, plagiarism API integration"
        canonical="/plagiarism-checker-api"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PlagZap API",
          "applicationCategory": "DeveloperApplication",
          "description": "RESTful API for plagiarism detection and AI content checking",
          "offers": {
            "@type": "Offer",
            "price": "9.99",
            "priceCurrency": "USD"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-6">
            <Code className="h-4 w-4" />
            Developer-Friendly API
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              PlagZap API
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Integrate powerful plagiarism detection and AI content checking into your application with our simple RESTful API. Built for developers, trusted by enterprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/api-docs')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              <Book className="inline h-5 w-5 mr-2" />
              View Documentation
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Get API Key
            </button>
          </div>
        </motion.div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-8 md:p-12 mb-16 border border-white/10">
          <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
          <div className="bg-black/60 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-cyan-400">
{`// Install the SDK
npm install plagzap-api

// Initialize
const PlagZap = require('plagzap-api');
const client = new PlagZap('YOUR_API_KEY');

// Check for plagiarism
const result = await client.check({
  text: "Your content here...",
  options: {
    aiDetection: true,
    sources: 'web+academic'
  }
});

console.log(result.plagiarismScore); // 0-100
console.log(result.aiScore);         // 0-100
console.log(result.matches);         // Array of sources`}
            </pre>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">API Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Lightning Fast',
                desc: 'Average response time under 2 seconds for 1000 words'
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Secure & Private',
                desc: 'Enterprise-grade encryption, no data retention'
              },
              {
                icon: <Code className="h-6 w-6" />,
                title: 'RESTful Design',
                desc: 'Simple HTTP endpoints, works with any language'
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                title: '99.9% Uptime',
                desc: 'Reliable infrastructure with SLA guarantees'
              },
              {
                icon: <Terminal className="h-6 w-6" />,
                title: 'Webhooks',
                desc: 'Real-time notifications for async processing'
              },
              {
                icon: <Book className="h-6 w-6" />,
                title: 'Comprehensive Docs',
                desc: 'Detailed guides, examples, and SDKs'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
              >
                <div className="text-cyan-400 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Main Endpoints</h2>
          <div className="space-y-4">
            {[
              {
                method: 'POST',
                endpoint: '/v1/check',
                desc: 'Check text for plagiarism and AI content',
                color: 'green'
              },
              {
                method: 'POST',
                endpoint: '/v1/check/file',
                desc: 'Upload and check a document (PDF, DOC, TXT)',
                color: 'green'
              },
              {
                method: 'GET',
                endpoint: '/v1/results/:id',
                desc: 'Retrieve results for a previous check',
                color: 'blue'
              },
              {
                method: 'POST',
                endpoint: '/v1/humanize',
                desc: 'Humanize AI-generated content',
                color: 'green'
              },
              {
                method: 'GET',
                endpoint: '/v1/usage',
                desc: 'Get API usage statistics',
                color: 'blue'
              }
            ].map((endpoint, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  endpoint.color === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {endpoint.method}
                </span>
                <div className="flex-1">
                  <code className="text-cyan-400 font-mono">{endpoint.endpoint}</code>
                  <p className="text-gray-400 text-sm mt-1">{endpoint.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">API Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$9.99',
                requests: '1,000 requests/month',
                features: ['Basic support', 'Web sources only', '99% uptime SLA']
              },
              {
                name: 'Professional',
                price: '$49.99',
                requests: '10,000 requests/month',
                features: ['Priority support', 'Web + Academic sources', '99.9% uptime SLA', 'Webhooks'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                requests: 'Unlimited requests',
                features: ['Dedicated support', 'All sources', '99.99% uptime SLA', 'Webhooks', 'Custom integration', 'White-label option']
              }
            ].map((plan, idx) => (
              <div key={idx} className={`rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-2 border-cyan-500/50 relative' 
                  : 'bg-gray-900/50 border border-white/10'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-2">{plan.price}</div>
                <p className="text-gray-400 text-sm mb-6">{plan.requests}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(plan.name === 'Enterprise' ? '/contact' : '/pricing')}
                  className={`w-full px-6 py-3 rounded-xl font-bold transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Content Management Systems',
                desc: 'Integrate plagiarism checking into WordPress, Drupal, or custom CMS platforms'
              },
              {
                title: 'Learning Management Systems',
                desc: 'Add plagiarism detection to Canvas, Moodle, Blackboard, or custom LMS'
              },
              {
                title: 'Writing Platforms',
                desc: 'Enhance Medium, Substack, or custom blogging platforms with originality checks'
              },
              {
                title: 'Content Agencies',
                desc: 'Automate quality control for freelance content submissions'
              }
            ].map((useCase, idx) => (
              <div key={idx} className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold mb-6">Ready to Integrate?</h2>
          <p className="text-gray-400 mb-8">Get your API key and start building in minutes</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/api-docs')}
              className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl"
            >
              View Documentation
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl"
            >
              Get API Key Free
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlagiarismCheckerAPI;

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, DollarSign, Users, Zap, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const TurnitinAlternative = () => {
  const navigate = useNavigate();

  const comparison = [
    { feature: 'Price (Monthly)', turnitin: '$3-5 per student', plagzap: '$9.99 unlimited' },
    { feature: 'Individual Access', turnitin: 'Institutional only', plagzap: 'Yes, anyone' },
    { feature: 'AI Detection', turnitin: 'Basic', plagzap: 'Advanced AI models' },
    { feature: 'Instant Results', turnitin: 'Up to 24 hours', plagzap: 'Under 10 seconds' },
    { feature: 'Free Trial', turnitin: 'No', plagzap: 'Yes, 2000 words' },
    { feature: 'API Access', turnitin: 'Enterprise only', plagzap: 'All paid plans' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="Turnitin Alternative — Institutional Plagiarism Checker | Plagzap"
        description="Looking for a Turnitin alternative? PlagZap offers faster, more affordable plagiarism detection for universities and individuals. Compare features and pricing."
        keywords="turnitin alternative, plagiarism checker for universities, institutional plagiarism checker, turnitin vs plagzap, turnitin competitor"
        canonical="/turnitin-alternative"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Turnitin Alternative - PlagZap",
          "description": "Compare PlagZap with Turnitin for institutional plagiarism checking"
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Better, Faster, More Affordable
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            The Best <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Turnitin Alternative</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Get institutional-grade plagiarism detection without the institutional price tag. PlagZap offers faster results, better AI detection, and flexible pricing for universities and individuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/analyzer')}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Try Free Now
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              View Pricing
            </button>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Turnitin vs PlagZap: Feature Comparison</h2>
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-800/50 p-4 font-bold border-b border-white/10">
              <div>Feature</div>
              <div className="text-center">Turnitin</div>
              <div className="text-center text-orange-400">PlagZap</div>
            </div>
            {comparison.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="font-medium">{row.feature}</div>
                <div className="text-center text-gray-400">{row.turnitin}</div>
                <div className="text-center text-orange-400 font-semibold">{row.plagzap}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Switch */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Why Universities Choose PlagZap</h3>
            <ul className="space-y-4">
              {[
                'Flexible pricing - pay per user or unlimited',
                'Faster turnaround times (seconds vs hours)',
                'Advanced AI detection for ChatGPT, Claude, Gemini',
                'White-label options for institutional branding',
                'Comprehensive API for LMS integration',
                'Dedicated support team'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Perfect for Individuals Too</h3>
            <ul className="space-y-4">
              {[
                'No institutional requirement - anyone can sign up',
                'Free tier with 2,000 words per check',
                'Affordable monthly plans starting at $9.99',
                'Check unlimited documents',
                'Save and organize your scan history',
                'Export detailed PDF reports'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Sarah Mitchell',
                role: 'Professor, Stanford University',
                text: 'We switched from Turnitin to PlagZap and haven\'t looked back. The speed and accuracy are unmatched.',
                rating: 5
              },
              {
                name: 'James Chen',
                role: 'Graduate Student',
                text: 'Finally, a plagiarism checker I can afford as an individual student. Works just as well as Turnitin.',
                rating: 5
              },
              {
                name: 'Maria Rodriguez',
                role: 'Content Manager',
                text: 'PlagZap\'s AI detection caught paraphrased content that Turnitin missed. Impressive technology.',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
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
                q: 'Can PlagZap integrate with our university LMS?',
                a: 'Yes! PlagZap offers API integration for Canvas, Blackboard, Moodle, and other major LMS platforms. Contact our enterprise team for setup assistance.'
              },
              {
                q: 'How does PlagZap compare to Turnitin in accuracy?',
                a: 'PlagZap uses advanced AI models that achieve 98.4% accuracy, comparable to or better than Turnitin. We scan billions of sources including academic databases.'
              },
              {
                q: 'Do you offer institutional pricing?',
                a: 'Yes, we offer flexible institutional pricing based on student count or unlimited access. Contact us for a custom quote.'
              },
              {
                q: 'Can students use PlagZap individually?',
                a: 'Absolutely! Unlike Turnitin, PlagZap is available to anyone. Students can use our free tier or subscribe individually.'
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
          <h2 className="text-4xl font-bold mb-6">Ready to Switch from Turnitin?</h2>
          <p className="text-gray-400 mb-8">Try PlagZap free today and see the difference</p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TurnitinAlternative;

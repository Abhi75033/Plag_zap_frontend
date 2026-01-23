import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Shield, CheckCircle, Zap, Users, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const LandingPage = ({ 
  title, 
  description, 
  heroTitle, 
  heroSubtitle, 
  targetAudience, 
  features, 
  faq,
  schema
}) => {
  return (
    <>
      <SEO 
        title={title} 
        description={description} 
        canonical={`/plagzap-for-${targetAudience.toLowerCase().replace(/\s+/g, '-')}`}
        schema={schema}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span>#1 Plagiarism Checker for {targetAudience}</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                    {heroTitle}
                  </span>
                </h1>
                
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {heroSubtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    to="/register" 
                    className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                  >
                    Start Checking for Free <ArrowRight size={20} />
                  </Link>
                  <Link 
                    to="/analyzer" 
                    className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all border border-white/10"
                  >
                    Try Live Demo
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why {targetAudience} Choose PlagZap</h2>
              <p className="text-gray-400">Tailored features designed to protect your reputation and SEO rankings.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-background border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-6">
                    {feature.icon || <CheckCircle />}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">Everything {targetAudience} needs to know about PlagZap.</p>
            </div>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <div key={index} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                  <p className="text-gray-400">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Protect Your Content?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of {targetAudience.toLowerCase()} who trust PlagZap for original, SEO-safe content.
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;

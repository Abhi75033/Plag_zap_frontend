import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Quote, Star, User, Building, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const CaseStudies = () => {
  const navigate = useNavigate();

  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "SEO Specialist",
      company: "TechGrowth Agency",
      content: "PlagZap has revolutionized our content production workflow. We publish 50+ articles a week, and PlagZap ensures every single one is 100% original and AI-free. The API integration was seamless.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Dr. Michael Chen",
      role: "Professor of Literature",
      company: "University of California",
      content: "I recommend PlagZap to all my students. It's affordable, accurate, and helps them learn proper citation practices. It's a fantastic alternative to the expensive institutional tools.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Elena Rodriguez",
      role: "Freelance Writer",
      company: "Self-Employed",
      content: "As a freelancer, my reputation is everything. PlagZap gives me the peace of mind that my work is unique before I submit it to clients. The free tier is generous, and the premium is worth every penny.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="Success Stories & Reviews — Trusted by 10,000+ Users | Plagzap"
        description="See how PlagZap helps students, teachers, agencies, and writers ensure content originality. Read case studies and reviews from happy users."
        keywords="plagzap reviews, plagiarism checker success stories, plagzap testimonials, customer stories, user reviews"
        canonical="/case-studies"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "PlagZap Success Stories",
          "description": "Reviews and case studies from PlagZap users",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": reviews.map((review, index) => ({
              "@type": "Review",
              "position": index + 1,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": "5"
              },
              "author": {
                "@type": "Person",
                "name": review.name
              },
              "reviewBody": review.content
            }))
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm font-medium mb-6">
            <Star className="h-4 w-4 fill-yellow-300" />
            Trusted by 10,000+ Users
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Success <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Stories</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Discover how creators, educators, and businesses use PlagZap to maintain integrity and ensure originality in their work.
          </p>
        </motion.div>

        {/* Featured Case Study */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6 text-yellow-500 font-bold tracking-wider text-sm uppercase">
                <Building className="h-4 w-4" />
                Enterprise Case Study
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How ContentCorp Scaled Production with 0% Plagiarism</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                "Before PlagZap, we spent hours manually checking articles. With PlagZap's API, we automated the entire process, cutting our QA time by 80% while ensuring 100% originality for our enterprise clients."
              </p>
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">80%</div>
                  <div className="text-sm text-gray-400">Time Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">10k+</div>
                  <div className="text-sm text-gray-400">Docs Scanned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center">
                 {/* Placeholder for video or image */}
                 <div className="text-center">
                    <Quote className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Video Case Study Coming Soon</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 hover:border-yellow-500/30 transition-all"
            >
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 italic leading-relaxed">"{review.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                   {/* Fallback avatar if external image fails */}
                   <User className="w-full h-full p-2 text-gray-400" />
                </div>
                <div>
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-xs text-gray-400">{review.role}</div>
                  <div className="text-xs text-indigo-400">{review.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl p-12 text-center border border-yellow-500/20">
          <h2 className="text-3xl font-bold mb-6">Join Thousands of Happy Users</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Start checking your content today with the most trusted AI plagiarism detector on the market.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-black font-bold text-xl rounded-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-2 mx-auto"
          >
            Get Started Free <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CaseStudies;

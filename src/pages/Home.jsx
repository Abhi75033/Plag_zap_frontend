import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  History, 
  Sparkles, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  Scan, 
  ArrowRight, 
  Lock,
  Cpu,
  Fingerprint,
  Star,
  MessageSquare,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

// --- Utility Components ---


const SpotlightCard = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-white/10 bg-gray-900/50 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(147, 51, 234, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse delay-1000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[140px] animate-pulse delay-2000" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
};

// --- Main Page Sections ---

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center pt-10 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full z-10">
        
        {/* Left Content */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
              <Sparkles className="h-3 w-3" />
              <span>Powered by Gemini 1.5 Pro</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Authenticity <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
                Redefined.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              The only AI detector that understands context. Detect plagiarism, humanize AI text, and polish your content in one seamless workflow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button 
              onClick={() => navigate('/analyzer')}
              className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 hover:scale-105"
            >
              <Zap className="h-5 w-5" />
              Get Started
            </button>
            <a 
              href="/plagzap-extension.zip"
              download="plagzap-extension.zip"
              className="px-8 py-4 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-200 font-bold text-lg hover:bg-blue-600/30 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Zap className="h-5 w-5 text-blue-400" />
              Download Extension
            </a>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500"
          >
            <div className="flex -space-x-2">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-gray-700 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                 </div>
               ))}
            </div>
            <p>Trusted by 10,000+ writers</p>
          </motion.div>
        </div>

        {/* Right Visual - 3D Card Effect */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative perspective-1000 hidden lg:block"
        >
            {/* Abstract Decorative Elements behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/30 to-blue-500/30 rounded-full blur-[100px] -z-10" />

            {/* The Main "App" Interface Card */}
            <div className="relative w-full max-w-lg mx-auto bg-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
                {/* Header of fake app */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                    <div className="ml-auto px-3 py-1 rounded-full bg-black/40 text-[10px] font-mono text-gray-400">
                        Analyzing...
                    </div>
                </div>
                {/* Body of fake app */}
                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        <div className="h-2 w-3/4 bg-gray-700/50 rounded animate-pulse" />
                        <div className="h-2 w-full bg-gray-700/50 rounded animate-pulse delay-75" />
                        <div className="h-2 w-5/6 bg-gray-700/50 rounded animate-pulse delay-150" />
                    </div>
                    
                    {/* Simulated Detection Result */}
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-4">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                            <Fingerprint className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm">AI Content Detected</h4>
                            <p className="text-gray-400 text-xs mt-1">Probability: <span className="text-red-400 font-mono">98.4%</span></p>
                        </div>
                        <button className="ml-auto px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors">
                            Humanize
                        </button>
                    </div>

                    <div className="space-y-3 pt-2">
                         <div className="h-2 w-full bg-gray-700/30 rounded" />
                         <div className="h-2 w-2/3 bg-gray-700/30 rounded" />
                    </div>
                </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-8 top-20 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-3"
            >
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                    <div className="text-xs text-gray-400">Originality Score</div>
                    <div className="text-lg font-bold text-white">100%</div>
                </div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      title: 'Deep AI Detection',
      description: 'Multi-layer analysis utilizing Gemini logic to spot AI patterns that others miss.',
    },
    {
      icon: <Cpu className="h-6 w-6 text-violet-400" />,
      title: 'Style Matching',
      description: 'Our humanizer adapts to your specific writing tone, maintaining your unique voice.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-400" />,
      title: 'Instant Rewrite',
      description: 'Transform robotic text into natural, flowing prose in under 3 seconds.',
    },
    {
      icon: <Lock className="h-6 w-6 text-emerald-400" />,
      title: 'Privacy First',
      description: 'Your text is analyzed in memory and never stored for training data.',
    },
    {
      icon: <FileText className="h-6 w-6 text-pink-400" />,
      title: 'Detailed Reports',
      description: 'Get sentence-by-sentence breakdowns of perplexity and burstiness.',
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-cyan-400" />,
      title: 'Bulk Processing',
      description: 'Upload multiple documents at once for enterprise-grade analysis workflows.',
    },
  ];

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Beyond Simple Checking
          </h2>
          <p className="text-gray-400 text-lg">
            PlagZap offers a complete suite of tools designed to ensure your content is authentic, engaging, and undetectable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <SpotlightCard key={idx} className="rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
    return (
        <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            From Robot to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Human in One Click</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                { step: "01", title: "Paste Content", desc: "Input your text or upload a file. We support all major formats." },
                                { step: "02", title: "Deep Scan", desc: "Our engine checks against 50B+ parameters to find AI traces." },
                                { step: "03", title: "Humanize", desc: "Apply advanced rephrasing to smooth out syntax and bypass detectors." }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-6 group">
                                    <div className="text-4xl font-bold text-white/10 group-hover:text-violet-500/50 transition-colors font-mono">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-violet-600/20 blur-[80px] rounded-full" />
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10">
                            <div className="font-mono text-xs text-gray-500 mb-4 flex justify-between">
                                <span>input.txt</span>
                                <span>READ-ONLY</span>
                            </div>
                            <div className="space-y-2 mb-6">
                                <p className="text-gray-300 text-sm opacity-50 line-through decoration-red-500 decoration-2">
                                    Furthermore, it is important to consider the various implications of the aforementioned technological advancements in the digital sphere.
                                </p>
                                <div className="flex items-center gap-2 text-violet-400 text-xs font-bold py-2">
                                    <ArrowRight className="h-3 w-3" />
                                    <span>HUMANIZING...</span>
                                </div>
                                <p className="text-white text-base font-medium">
                                    We also need to look at how these new tech tools really affect our digital lives. It's not just about speed; it's about connection.
                                </p>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                                    animate={{ width: ["0%", "100%"] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 1 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Testimonials = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', role: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
  
  // Dummy testimonials (shown by default)
  const dummyTestimonials = [
    {
      name: "Sarah Jenkins",
      role: "Content Manager @ TechFlow",
      text: "PlagZap saved us hours of editing time. The humanization feature is indistinguishable from our senior writers' output.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Freelance Copywriter",
      text: "I was skeptical about AI detection, but this tool found flagged content that 3 other checkers missed. Essential for my workflow.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Academic Researcher",
      text: "The most accurate detector I've used. It gives me peace of mind before submitting my papers.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      rating: 5
    },
    {
      name: "Michael Thompson",
      role: "SEO Specialist @ GrowthLabs",
      text: "Game changer for content teams! We run all our blog posts through PlagZap before publishing. The rewrite suggestions are gold.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "PhD Student",
      text: "As a non-native English speaker, this tool helps me ensure my academic writing doesn't accidentally mirror common AI patterns. Highly recommend!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      rating: 4
    },
    {
      name: "James Wilson",
      role: "Marketing Director",
      text: "We've integrated PlagZap into our entire content pipeline. The API is fast, reliable, and the accuracy is unmatched.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      rating: 5
    }
  ];

  // Fetch approved feedbacks from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await import('../services/api').then(m => m.getApprovedFeedbacks());
        setApprovedFeedbacks(data.feedbacks || []);
      } catch (error) {
        console.error('Failed to load feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, [feedbackSubmitted]);

  // Combine dummy + approved feedbacks
  const allTestimonials = [
    ...dummyTestimonials,
    ...approvedFeedbacks.map(f => ({
      name: f.name,
      role: f.role,
      text: f.message,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.name}`,
      rating: f.rating,
      isUserSubmitted: true
    }))
  ];

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.message || submitting) return;

    setSubmitting(true);
    try {
      const api = await import('../services/api');
      await api.submitFeedback({
        name: feedbackForm.name,
        role: feedbackForm.role,
        message: feedbackForm.message,
        rating: rating
      });
      
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setShowFeedbackForm(false);
        setFeedbackSubmitted(false);
        setFeedbackForm({ name: '', role: '', message: '' });
        setRating(5);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 relative z-10 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Loved by <span className="text-violet-400">Creators</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            See what our users are saying about PlagZap
          </p>
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 mx-auto shadow-lg shadow-violet-500/20"
          >
            <MessageSquare className="h-5 w-5" />
            Share Your Feedback
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTestimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={`bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-[1.02] ${
                t.isUserSubmitted ? 'ring-2 ring-violet-500/50' : ''
              }`}
            >
              {t.isUserSubmitted && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full mb-3">
                  <Sparkles className="h-3 w-3" />
                  New Feedback
                </div>
              )}
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star 
                    key={idx} 
                    className={`h-4 w-4 ${idx < t.rating ? 'fill-current' : 'opacity-30'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full bg-gray-700" />
                <div>
                  <h4 className="text-white font-bold text-sm">{t.name}</h4>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feedback Form Modal */}
        <AnimatePresence>
          {showFeedbackForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowFeedbackForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {feedbackSubmitted ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="h-10 w-10 text-green-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                    <p className="text-gray-400">Your feedback has been submitted successfully.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Share Your Feedback</h3>
                      <button 
                        onClick={() => setShowFeedbackForm(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSubmitFeedback} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={feedbackForm.name}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Your Role (Optional)</label>
                        <input
                          type="text"
                          value={feedbackForm.role}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, role: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                          placeholder="Content Writer @ Company"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star 
                                className={`h-8 w-8 ${
                                  star <= rating 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-600'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Your Message *</label>
                        <textarea
                          required
                          value={feedbackForm.message}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                          rows={4}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                          placeholder="Tell us about your experience with PlagZap..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="h-5 w-5" />
                        Submit Feedback
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    { q: "How accurate is the detection?", a: "Our model achieves a 98.4% accuracy rate by cross-referencing perplexity scores with known AI writing patterns from GPT-4, Claude, and Gemini." },
    { q: "Does the humanizer change the meaning?", a: "No. Our humanizer is context-aware. It restructures sentences to vary flow and vocabulary while strictly preserving your original intent and key information." },
    { q: "Do you support multiple languages?", a: "Currently, we support English, Spanish, French, and German. We are actively adding support for 10 more languages in the next update." },
    { q: "Is my content stored?", a: "Absolutely not. We process your text in real-time RAM and discard it immediately after analysis. Your work remains 100% confidential." }
  ];

  return (
    <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-black/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl bg-gray-900/30 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-400 leading-relaxed text-sm">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



const CTA = () => (
  
  <section className="py-32 px-6 relative z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/10 to-transparent pointer-events-none" />
    <div className="max-w-4xl mx-auto text-center relative">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
        Ready to <span className="text-violet-400">Zap</span> the Bots?
      </h2>
      <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
        Join over 10,000 writers, students, and professionals ensuring their content is authentic and impactful.
      </p>
      <button 
        onClick={() => navigate('/analyzer')}
        className="px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-violet-500/20"
      >
        Get Started for Free
      </button>
      <p className="mt-6 text-sm text-gray-600">No credit card required • Cancel anytime</p>
    </div>
  </section>
);

const Footer = () => {
  const navigate = useNavigate();
  
  const footerLinks = {
    Product: [
      { name: 'Features', path: '/features' },
      { name: 'Integrations', path: '/integrations' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Changelog', path: '/changelog' },
    ],
    Company: [
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    Legal: [
      { name: 'Privacy', path: '/privacy' },
      { name: 'Terms', path: '/terms' },
      { name: 'Refunds', path: '/refunds' },
      { name: 'Shipping', path: '/shipping' },
    ],
  };

  return (
    <footer className="border-t border-white/5 bg-black/40 pt-20 pb-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Scan className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-white">PlagZap</span>
          </div>
          <p className="text-gray-500 text-sm">
            Ensuring originality in the age of artificial intelligence.
          </p>
        </div>
        
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-white font-bold mb-6">{title}</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {links.map(link => (
                <li key={link.name}>
                  <button 
                    onClick={() => navigate(link.path)} 
                    className="hover:text-violet-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
        <p>© 2024 PlagZap Inc. All rights reserved.</p>
        <div className="flex gap-6">
           <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
           <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
           <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
        </div>
      </div>
    </footer>
  );
};

// --- Simple Analyzer View ---
const AnalyzerView = ({ navigate }) => (
    <div className="min-h-screen pt-24 px-6 flex flex-col items-center relative z-10">
        <button onClick={() => navigate('/')} className="absolute top-24 left-6 text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
        </button>
        <div className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Content Analyzer</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-white/10">Upload File</button>
                    <button className="px-4 py-2 bg-violet-600 rounded-lg text-sm text-white font-bold hover:bg-violet-700">Check Text</button>
                </div>
            </div>
            <textarea 
                className="flex-1 bg-black/40 border border-white/10 rounded-xl p-6 text-gray-300 focus:outline-none focus:border-violet-500/50 resize-none font-mono text-sm leading-relaxed"
                placeholder="Paste your text here to analyze for AI patterns..."
            ></textarea>
            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>0 words</span>
                <span>Ready to scan</span>
            </div>
        </div>
    </div>
);

// --- Main App Component ---

const App = () => {
  const [currentPath, setCurrentPath] = useState('/');

  // Simulate routing navigation
  const navigate = (path) => {
    setCurrentPath(path);
  };

  // Scroll to top when path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-violet-500/30 selection:text-white">
      <AnimatedBackground />
      {/* Navbar Removed */}
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentPath === '/' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero navigate={navigate} />
              <Features />
              <HowItWorks />
              <Testimonials />
              <FAQ />
              <CTA navigate={navigate} />
              <Footer />
            </motion.div>
          ) : currentPath === '/analyzer' ? (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyzerView navigate={navigate} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
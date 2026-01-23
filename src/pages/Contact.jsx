import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { submitContact } from '../services/contactAPI';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await submitContact(formData);
      toast.success(response.data.message || 'Message sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-400">We'd love to hear from you. Get in touch with our team.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background/50 border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Send us a message</h2>
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400 mb-2">Thank you for reaching out!</p>
                <p className="text-sm text-gray-500">We've sent a confirmation email to {formData.email}.</p>
                <p className="text-sm text-gray-500 mt-2">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="Your name"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="your@email.com"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="How can we help?"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                    placeholder="Your message..."
                    disabled={submitting}
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.message.length}/2000</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {[
              { icon: <Mail />, title: 'Email', info: 'team@plagzap.xyz', sub: 'We reply within 24 hours' },
              { icon: <MapPin />, title: 'Office', info: 'Bangalore, India', sub: 'Tech Hub, Electronic City' },
              { icon: <Phone />, title: 'Phone', info: '+91 98765 43210', sub: 'Mon-Fri, 9am-6pm IST' },
              { icon: <Clock />, title: 'Support Hours', info: '24/7 Available', sub: 'For premium customers' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-background/50 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-gray-300">{item.info}</p>
                  <p className="text-sm text-gray-500">{item.sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
              <MessageSquare className="h-8 w-8 text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Quick Support</h3>
              <p className="text-gray-400 text-sm mb-4">Need immediate help? Email our support team for quick assistance.</p>
              <a 
                href="mailto:team@plagzap.xyz?subject=Quick Support Request&body=Hi, I need help with..."
                className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Email Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

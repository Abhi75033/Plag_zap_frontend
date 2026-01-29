import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram, 
  Send, 
  Heart,
  Shield,
  Zap,
  CheckCircle,
  Mail
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    Product: [
      { name: 'Features', path: '/features' },
      { name: 'Integrations', path: '/integrations' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Changelog', path: '/changelog' },
      { name: 'Download Extension', path: '/download' },
    ],
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'News', path: '/news' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    Legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Refund Policy', path: '/refunds' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'GDPR Compliance', path: '/gdpr' },
    ],
    Resources: [
        { name: 'Help Center', path: '/help' },
        { name: 'API Docs', path: '/api-docs' },
        { name: 'Community', path: '/community' },
        { name: 'Partners', path: '/partners' },
    ]
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com/plagzap', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com/company/plagzap', label: 'LinkedIn' },
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/plagzap', label: 'GitHub' },
    { icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com/plagzap', label: 'Instagram' },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-black/40 pt-24 pb-12 overflow-hidden z-10">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Zap className="text-white h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">PlagZap</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                    Empowering creators with the most advanced AI detection and humanization technology. integrity in every word.
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-white font-semibold mb-2">Subscribe to our newsletter</h4>
                <p className="text-xs text-gray-400 mb-4">Get the latest updates and AI writing tips.</p>
                <div className="flex gap-2">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 transition-colors">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-6">
                <h4 className="text-white font-bold text-sm tracking-wider uppercase opacity-80">{category}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                        <button 
                            onClick={() => navigate(link.path)}
                            className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                        >
                            <span className="w-0 group-hover:w-2 h-[1px] bg-violet-500 transition-all duration-300" />
                            {link.name}
                        </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-500">
                <p>© 2024 PlagZap Inc. All rights reserved.</p>
                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
                <p>Founded by Abhishek Kumar</p>
                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
                <p className="flex items-center gap-1">
                    Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> in India
                </p>
            </div>

            <div className="flex gap-4">
                {socialLinks.map((social) => (
                    <a 
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all duration-300"
                        aria-label={social.label}
                    >
                        {social.icon}
                    </a>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

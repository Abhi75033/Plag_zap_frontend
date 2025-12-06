import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Star, Bug, Zap, Plus, RefreshCw } from 'lucide-react';

const Changelog = () => {
  const releases = [
    {
      version: '2.1.0',
      date: 'December 5, 2024',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Added Stripe payment integration for subscription plans' },
        { type: 'feature', text: 'New AI Text Humanizer with improved accuracy' },
        { type: 'improvement', text: 'Redesigned pricing page with FAQ section' },
        { type: 'improvement', text: 'Enhanced dark mode aesthetics' },
      ]
    },
    {
      version: '2.0.0',
      date: 'November 28, 2024',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Complete UI redesign with modern glassmorphism' },
        { type: 'feature', text: 'Added subscription tiers: Monthly, Quarterly, Biannual, Annual' },
        { type: 'feature', text: 'New analysis history dashboard' },
        { type: 'improvement', text: 'Upgraded to Gemini 1.5 Pro for better detection' },
      ]
    },
    {
      version: '1.5.0',
      date: 'November 15, 2024',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'Added text rewriting/humanization feature' },
        { type: 'improvement', text: 'Improved plagiarism detection accuracy by 15%' },
        { type: 'fix', text: 'Fixed issue with long text analysis timeout' },
      ]
    },
    {
      version: '1.4.0',
      date: 'November 1, 2024',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'Added user authentication system' },
        { type: 'feature', text: 'Added analysis history tracking' },
        { type: 'improvement', text: 'Better error handling and user feedback' },
      ]
    },
    {
      version: '1.0.0',
      date: 'October 15, 2024',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Initial release of PlagZap' },
        { type: 'feature', text: 'AI-powered plagiarism detection using Gemini' },
        { type: 'feature', text: 'Color-coded highlighting for analysis results' },
      ]
    },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'feature': return <Plus className="h-4 w-4 text-green-400" />;
      case 'improvement': return <Zap className="h-4 w-4 text-blue-400" />;
      case 'fix': return <Bug className="h-4 w-4 text-orange-400" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-4 rounded-full bg-purple-500/20 mb-6">
            <GitCommit className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Changelog
          </h1>
          <p className="text-xl text-gray-400">Track all the updates and improvements to PlagZap</p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

          <div className="space-y-12">
            {releases.map((release, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="relative md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-purple-500 border-4 border-background hidden md:block" />
                
                <div className="bg-background/50 border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      release.type === 'major' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      v{release.version}
                    </span>
                    <span className="text-gray-400 text-sm">{release.date}</span>
                    {idx === 0 && <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs"><Star className="h-3 w-3" /> Latest</span>}
                  </div>
                  <ul className="space-y-2">
                    {release.changes.map((change, changeIdx) => (
                      <li key={changeIdx} className="flex items-start gap-3">
                        {getIcon(change.type)}
                        <span className="text-gray-300">{change.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;

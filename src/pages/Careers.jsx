import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Users, Coffee } from 'lucide-react';

const Careers = () => {
  const jobs = [
    { title: 'Senior Full-Stack Developer', location: 'Remote / Bangalore', type: 'Full-time', department: 'Engineering' },
    { title: 'ML Engineer', location: 'Remote', type: 'Full-time', department: 'AI & ML' },
    { title: 'Product Designer', location: 'Bangalore', type: 'Full-time', department: 'Design' },
    { title: 'DevOps Engineer', location: 'Remote', type: 'Full-time', department: 'Engineering' },
    { title: 'Content Marketing Manager', location: 'Remote', type: 'Full-time', department: 'Marketing' },
    { title: 'Customer Success Lead', location: 'Bangalore', type: 'Full-time', department: 'Support' },
  ];

  const perks = [
    { icon: <Heart />, title: 'Health & Wellness', desc: 'Comprehensive health insurance for you and family' },
    { icon: <Zap />, title: 'Learning Budget', desc: '₹50,000/year for courses, books, and conferences' },
    { icon: <Users />, title: 'Remote Friendly', desc: 'Work from anywhere in India' },
    { icon: <Coffee />, title: 'Unlimited PTO', desc: 'Take time off when you need it' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us build the future of content authenticity. We're looking for passionate people to join our mission.
          </p>
        </motion.div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {perks.map((perk, idx) => (
            <div key={idx} className="bg-background/50 border border-white/10 rounded-xl p-6 text-center">
              <div className="inline-flex p-3 rounded-xl bg-purple-500/20 text-purple-400 mb-4">
                {perk.icon}
              </div>
              <h3 className="font-bold text-white mb-1">{perk.title}</h3>
              <p className="text-sm text-gray-400">{perk.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div 
                key={idx} 
                className="bg-background/50 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/30 transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">{job.department}</span>
                  <h3 className="text-xl font-bold text-white mt-2 group-hover:text-purple-400 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all group-hover:gap-3">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Don't see a role that fits?</h2>
          <p className="text-gray-400 mb-6">We're always looking for talented people. Send us your resume!</p>
          <a href="mailto:careers@plagzap.com" className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors">
            Send Your Resume
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;

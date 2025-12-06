import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Award, Target, Heart } from 'lucide-react';

const About = () => {
  const team = [
    { name: 'Abhishek Kumar', role: 'Founder & CEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek' },
    { name: 'Priya Sharma', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { name: 'Rahul Verma', role: 'Head of AI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
    { name: 'Anjali Patel', role: 'Lead Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
  ];

  const values = [
    { icon: <Shield className="h-6 w-6" />, title: 'Trust & Integrity', desc: 'We believe in building trust through transparent and honest practices.' },
    { icon: <Zap className="h-6 w-6" />, title: 'Innovation', desc: 'Constantly pushing boundaries with cutting-edge AI technology.' },
    { icon: <Users className="h-6 w-6" />, title: 'User-Centric', desc: 'Every feature is designed with our users needs in mind.' },
    { icon: <Heart className="h-6 w-6" />, title: 'Passion', desc: 'We are passionate about helping creators protect their work.' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            About PlagZap
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're on a mission to ensure authenticity in the age of AI. Our advanced plagiarism detection 
            and humanization tools help creators, students, and professionals maintain originality.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 mb-20"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
            <div className="space-y-4 text-gray-400">
              <p>
                PlagZap was born out of a simple observation: as AI-generated content became ubiquitous, 
                the need for reliable detection and humanization tools grew exponentially.
              </p>
              <p>
                Founded in 2024, we set out to build the most accurate and user-friendly plagiarism 
                detection platform powered by Google's Gemini AI. Our goal is to help everyone from 
                students to professional writers ensure their content is authentic and original.
              </p>
              <p>
                Today, PlagZap serves over 10,000 users worldwide, processing millions of words daily 
                and helping maintain the integrity of written content across industries.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">10K+</div>
              <p className="text-gray-400">Happy Users Worldwide</p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-background/50 border border-white/10 rounded-xl p-6 text-center hover:border-purple-500/30 transition-all">
                <div className="inline-flex p-3 rounded-xl bg-purple-500/20 text-purple-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-500/50"
                />
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

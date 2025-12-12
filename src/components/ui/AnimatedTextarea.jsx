import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTextarea = ({ value, onChange, placeholder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20" />
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="relative w-full h-64 p-6 bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all duration-300 text-lg"
      />
    </motion.div>
  );
};

export default AnimatedTextarea;

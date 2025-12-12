import React from 'react';
import { motion } from 'framer-motion';

const RewriteCard = ({ title, content, score, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 p-6 shadow-xl"
    >
      <div className="absolute top-0 right-0 p-4">
        <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium animate-pulse">
          Score: {score}/100
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        {title}
      </h3>
      
      <div className="prose prose-invert max-w-none mb-6 text-gray-300 leading-relaxed">
        {content}
      </div>

      {onAction && (
        <div className="flex gap-4">
          <button
            onClick={() => onAction('accept')}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium"
          >
            Accept Rewrite
          </button>
          <button
            onClick={() => onAction('retry')}
            className="flex-1 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RewriteCard;

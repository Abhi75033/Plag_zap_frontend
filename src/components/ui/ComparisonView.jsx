import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const ComparisonView = ({ highlights }) => {
  // Filter only chunks that have matches or are relevant (or show all?)
  // Showing all gives context.
  
  return (
    <div className="space-y-4">
      {highlights.map((chunk, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border ${
            chunk.type === 'plagiarized' 
              ? 'border-red-500/30 bg-red-500/5' 
              : chunk.type === 'paraphrased'
              ? 'border-orange-500/30 bg-orange-500/5'
              : 'border-green-500/30 bg-green-500/5'
          }`}
        >
          {/* User Text */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase text-gray-400">Your Text</span>
                {chunk.type !== 'safe' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                        chunk.type === 'plagiarized' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                        {chunk.type}
                    </span>
                )}
             </div>
             <p className="text-sm leading-relaxed">{chunk.text}</p>
          </div>

          {/* Matched Source */}
          <div className="space-y-2 relative border-l md:border-l-0 md:border-l border-white/10 pl-0 md:pl-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase text-gray-400">
                    {chunk.type === 'safe' ? 'No Match Found' : 'Matched Source'}
                </span>
                {chunk.source && (
                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                        {chunk.source}
                    </span>
                 )}
             </div>
             
             {chunk.type === 'safe' ? (
                 <div className="flex items-center gap-2 text-green-500/50 text-sm italic mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <span>Unique content</span>
                 </div>
             ) : (
                 <div className="relative">
                    <p className="text-sm leading-relaxed text-gray-300 bg-black/20 p-3 rounded-lg font-mono text-xs">
                        {chunk.matchedText || "Source text not available"}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                         <span>Similarity: {Math.round(chunk.score * 100)}%</span>
                    </div>
                 </div>
             )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ComparisonView;

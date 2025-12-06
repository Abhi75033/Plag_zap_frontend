import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const HighlightTextBlock = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-white/10 leading-relaxed text-lg"
    >
      {highlights.map((chunk, index) => (
        <span
          key={index}
          className={cn(
            "transition-colors duration-300 px-1 rounded",
            chunk.type === 'plagiarized' && "bg-red-500/20 text-red-200 border-b-2 border-red-500",
            chunk.type === 'paraphrased' && "bg-orange-500/20 text-orange-200 border-b-2 border-orange-500",
            chunk.type === 'safe' && "text-foreground"
          )}
          title={chunk.source ? `Source: ${chunk.source}` : ''}
        >
          {chunk.text}{' '}
        </span>
      ))}
    </motion.div>
  );
};

export default HighlightTextBlock;

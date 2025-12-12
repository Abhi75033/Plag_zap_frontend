import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const HighlightTextBlock = ({ highlights }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!highlights || highlights.length === 0) return null;

  // Calculate total text length to decide whether to show "Read More"
  const totalLength = highlights.reduce((acc, chunk) => acc + (chunk.text ? chunk.text.length : 0), 0);
  const shouldTruncate = totalLength > 400; // Show button if text is longer than ~400 chars

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-white/10 leading-relaxed text-lg transition-all duration-500",
          !isExpanded && shouldTruncate ? "max-h-80 overflow-hidden relative" : ""
        )}
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
        
        {/* Gradient Overlay for truncated state */}
        {!isExpanded && shouldTruncate && (
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none rounded-b-xl" />
        )}
      </motion.div>

      {/* Toggle Button */}
      {shouldTruncate && (
        <div className="mt-4 flex justify-center">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
                {isExpanded ? (
                    <>
                        Read Less <ChevronUp className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        Read More <ChevronDown className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>
      )}
    </div>
  );
};

export default HighlightTextBlock;

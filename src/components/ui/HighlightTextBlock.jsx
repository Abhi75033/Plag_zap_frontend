import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
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
          "p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/30 backdrop-blur-lg border border-white/10 leading-loose text-base text-gray-100 transition-all duration-500 shadow-xl",
          !isExpanded && shouldTruncate ? "max-h-96 overflow-hidden relative" : ""
        )}
      >
        {highlights.map((chunk, index) => (
          <span
            key={index}
            className={cn(
              "transition-all duration-300 rounded-md px-1.5 py-0.5",
              chunk.type === 'plagiarized' && "bg-red-500/15 text-red-100 border-l-4 border-red-400/60 pl-2 shadow-sm",
              chunk.type === 'paraphrased' && "bg-amber-500/15 text-amber-100 border-l-4 border-amber-400/60 pl-2 shadow-sm",
              chunk.type === 'safe' && "text-gray-200"
            )}
            title={chunk.source ? `Source: ${chunk.source}` : ''}
          >
            {chunk.text}{' '}
          </span>
        ))}
        
        {/* Gradient Overlay for truncated state */}
        {!isExpanded && shouldTruncate && (
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent pointer-events-none rounded-b-2xl" />
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

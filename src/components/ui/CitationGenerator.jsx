import React, { useState } from 'react';
import { Copy, Check, BookOpen, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CitationGenerator = ({ source, isOpen, onClose }) => {
  const [format, setFormat] = useState('APA');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !source) return null;

  // Helper to format date
  const getTodayDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getYear = () => new Date().getFullYear();

  // Generate citation strings
  const generateCitation = (style) => {
    const title = source.title || 'Unknown Title';
    const url = source.url || '#';
    const author = source.author || 'Unknown Author';
    const siteName = source.siteName || new URL(url).hostname.replace('www.', '');

    switch (style) {
      case 'APA':
        // Author, A. A. (Year, Month Day). Title of page. Site Name. URL
        return `${author}. (${getYear()}). ${title}. ${siteName}. ${url}`;
      case 'MLA':
        // Author. "Title of Source." Title of Container, Publisher, Publication Date, Location.
        return `${author}. "${title}." ${siteName}, ${getTodayDate()}, ${url}.`;
      case 'Chicago':
        // Author. "Title of Page." Title of Website. Publication Date/Access Date. URL.
        return `${author}. "${title}." ${siteName}. Accessed ${getTodayDate()}. ${url}.`;
      case 'Harvard':
         // Author (Year) 'Title of page', Title of Website. Available at: URL (Accessed: Day Month Year).
        return `${author} (${getYear()}) '${title}', ${siteName}. Available at: ${url} (Accessed: ${getTodayDate()}).`;
      default:
        return url;
    }
  };

  const citationText = generateCitation(format);

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Quote className="w-5 h-5 text-purple-400" />
                Generate Citation
            </h3>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
            >
                ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Citation Style</label>
                <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
                    {['APA', 'MLA', 'Chicago', 'Harvard'].map((style) => (
                        <button
                            key={style}
                            onClick={() => setFormat(style)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                format === style 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Formatted Citation</label>
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 relative group">
                    <p className="text-sm text-gray-200 font-mono leading-relaxed pr-8 break-words">
                        {citationText}
                    </p>
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>
          </div>
          
          <div className="p-4 bg-white/5 flex justify-end gap-3">
             <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
             >
                Close
             </button>
             <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-2"
             >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Citation'}
             </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CitationGenerator;

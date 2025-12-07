import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import RewriteCard from '../components/ui/RewriteCard';
import { rewriteContent } from '../services/api';
import { Loader2, ArrowLeft, Wand2, Copy, Check, Download, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const RewriteResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { text: initialText, result, resultId } = location.state || {};
  
  console.log('RewriteResults mounted', { state: location.state });
  
  const [text, setText] = useState(initialText || '');
  const [rewrittenText, setRewrittenText] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hasRewritten, setHasRewritten] = useState(false);
  
  // Check if user is a paid subscriber
  const isPaidUser = user?.hasActiveSubscription === true;

  useEffect(() => {
    if (initialText) {
      handleRewrite();
    }
  }, [initialText]);

  const handleRewrite = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to humanize');
      return;
    }
    
    setLoading(true);
    setHasRewritten(true);
    try {
      const activeResultId = resultId || result?.id;
      const { data } = await rewriteContent(text, activeResultId);
      setRewrittenText(data.rewrittenText);
      setScore(data.rewriteScore || 95);
      toast.success('Text humanized successfully! ✨');
    } catch (error) {
      console.error('Rewrite failed:', error);
      setRewrittenText('Failed to rewrite content. Please try again.');
      toast.error('Failed to humanize text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    toast.success('Copied to clipboard!', { icon: '📋' });
    setTimeout(() => setCopied(false), 2000);
  };

  // Download humanized text as PDF - only for paid users
  const handleDownloadPDF = () => {
    // Check if user is subscribed
    if (!isPaidUser) {
      toast.error('PDF download is a premium feature. Please upgrade!');
      navigate('/pricing');
      return;
    }
    
    if (!rewrittenText) {
      toast.error('No humanized text to download');
      return;
    }

    // Create a print-friendly window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download the PDF');
      return;
    }

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PlagZap - Humanized Text Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            color: #1a1a1a;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #7c3aed;
          }
          .logo { font-size: 28px; font-weight: bold; color: #7c3aed; }
          .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
          .date { color: #888; font-size: 12px; margin-top: 10px; }
          .section { margin-bottom: 30px; }
          .section-title {
            font-size: 16px; font-weight: bold; color: #374151;
            margin-bottom: 15px; padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .content-box {
            background: #f9fafb; padding: 20px; border-radius: 8px;
            font-size: 14px; white-space: pre-wrap; word-wrap: break-word;
          }
          .score-badge {
            display: inline-block; background: #22c55e; color: white;
            padding: 5px 15px; border-radius: 20px; font-weight: bold;
            margin-bottom: 15px;
          }
          .footer {
            margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;
            text-align: center; color: #888; font-size: 12px;
          }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">⚡ PlagZap</div>
          <div class="subtitle">AI Text Humanizer Report</div>
          <div class="date">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <div class="section">
          <div class="section-title">Humanization Score</div>
          <span class="score-badge">${score}/100 Human-like</span>
        </div>

        <div class="section">
          <div class="section-title">Original Text (${text.split(/\s+/).filter(Boolean).length} words)</div>
          <div class="content-box">${text}</div>
        </div>

        <div class="section">
          <div class="section-title">Humanized Text</div>
          <div class="content-box">${rewrittenText}</div>
        </div>

        <div class="footer">
          <p>Generated by PlagZap AI Text Humanizer</p>
          <p>© ${new Date().getFullYear()} PlagZap. All rights reserved.</p>
        </div>

        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    toast.success('PDF report ready to download!');
  };

  const handleAction = (action) => {
    if (action === 'retry') {
      handleRewrite();
    } else {
      navigate('/history');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/analyzer')}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Analyzer
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        AI Text Humanizer
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-400">Original Content</h2>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your AI-generated or robotic text here to humanize it..."
              className="w-full h-[500px] p-6 rounded-2xl bg-background/30 border border-white/10 text-lg leading-relaxed text-gray-300 resize-none focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <div className="absolute bottom-4 right-4 text-sm text-gray-500">
              {text.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
          <button
            onClick={handleRewrite}
            disabled={loading || !text.trim()}
            className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Humanizing...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Humanize Text
              </>
            )}
          </button>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-400">Humanized Version</h2>
            {rewrittenText && !rewrittenText.includes('Failed') && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-400 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isPaidUser 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                  }`}
                  title={!isPaidUser ? 'Upgrade to download PDF' : 'Download as PDF'}
                >
                  {isPaidUser ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {isPaidUser ? 'Download PDF' : 'PDF (Pro)'}
                </button>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="h-[500px] flex flex-col items-center justify-center rounded-2xl bg-background/30 border border-white/10">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-400 animate-pulse">Humanizing your content...</p>
              <p className="text-sm text-gray-600 mt-2">This may take a few seconds</p>
            </div>
          ) : hasRewritten ? (
            <RewriteCard
              title="Optimized Content"
              content={rewrittenText}
              score={score}
              onAction={handleAction}
            />
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center rounded-2xl bg-background/30 border border-white/10 border-dashed">
              <Wand2 className="w-16 h-16 text-gray-700 mb-4" />
              <p className="text-gray-500 text-center px-8">
                Enter your text on the left and click "Humanize Text" to transform AI-generated content into natural, human-like writing.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RewriteResults;



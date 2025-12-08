import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AnimatedTextarea from '../components/ui/AnimatedTextarea';
import FileUploaderCard from '../components/ui/FileUploaderCard';
import HighlightTextBlock from '../components/ui/HighlightTextBlock';
import ScoreGauge from '../components/ui/ScoreGauge';
import { checkPlagiarism, checkGrammar, extractUrl } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { getUsage } from '../services/api';
import { FileText, Sparkles, AlertTriangle, CheckCircle, Upload, ArrowRight, Download, Columns, X, RefreshCw, Wand2, Link as LinkIcon, Zap, Loader2, Crown, AlertCircle, Clock, Globe, BookOpen, Lock } from 'lucide-react';
// import { downloadReport } from '../utils/pdfGenerator'; // Use new PDF renderer
import { PDFDownloadLink } from '@react-pdf/renderer';
import AnalysisReport from '../components/pdf/AnalysisReport';

import ComparisonView from '../components/ui/ComparisonView';
import CitationGenerator from '../components/ui/CitationGenerator';
import GrammarView from '../components/ui/GrammarView';
import PromoBanner from '../components/ui/PromoBanner';

const Analyzer = () => {
  const navigate = useNavigate();
  const { user } = useAppContext(); // Get user for report
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [grammarResult, setGrammarResult] = useState(null);
  const [viewMode, setViewMode] = useState('highlight'); // 'highlight', 'comparison', 'grammar'
  const { addToHistory } = useAppContext();
  const [usage, setUsage] = useState(null);
  const [citationSource, setCitationSource] = useState(null); // State for citation modal

  // Check if user has an active subscription (considers paused/suspended status)
  const isPaidUser = user?.hasActiveSubscription === true;
  const hasPaidTier = user?.subscriptionTier && user.subscriptionTier !== 'free';
  const subscriptionStatus = user?.canPerformAnalysis?.reason;
  const FREE_WORD_LIMIT = 500;

  // Helper to show proper message for premium features
  const showPremiumBlockedMessage = (featureName) => {
    // Check if user has a paid tier but subscription is not active
    if (hasPaidTier && !isPaidUser) {
      // Check the specific reason
      if (subscriptionStatus === 'SUBSCRIPTION_PAUSED') {
        toast.error('⏸️ Your subscription is paused. Check your dashboard for details.');
        return;
      } else if (subscriptionStatus === 'SUBSCRIPTION_SUSPENDED') {
        toast.error('🚫 Your subscription is suspended. Check your dashboard for details.');
        return;
      } else if (subscriptionStatus === 'SUBSCRIPTION_EXPIRED') {
        toast.error('Your subscription has expired. Please renew!');
        navigate('/pricing');
        return;
      }
      // Default for any paused/stopped state
      toast.error('Your subscription is on hold. Check your dashboard for details.');
      return;
    }
    // Free user trying to access premium feature
    toast.error(`${featureName} is a premium feature. Upgrade to access!`);
    navigate('/pricing');
  };

// ... inside render, before "Analysis Result" header


  const [inputType, setInputType] = useState('text'); // 'text', 'file', 'url'
  const [urlInput, setUrlInput] = useState('');
  const [extractingUrl, setExtractingUrl] = useState(false);

  // Load history on mount
  useEffect(() => {
    // loadHistory(); // Commented out as per original instruction, assuming context handles it.
  }, []);

  // const loadHistory = async () => { // Commented out as per original instruction, assuming context handles it.
  //   try {
  //     const res = await getHistory();
  //     // setHistory(res.data); // Removed local history state usage since context handles it? Or just refresh context?
  //   } catch (error) {
  //     console.error('Failed to load history:', error);
  //   }
  // };

  const handleUrlExtract = async (e) => {
    e.preventDefault();
    if (!urlInput) return;
    
    setExtractingUrl(true);
    try {
      const { data } = await extractUrl(urlInput);
      setText(data.text);
      toast.success('Content extracted from URL!');
      setInputType('text'); // Switch to text view to show/edit extracted content
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to extract content');
    } finally {
      setExtractingUrl(false);
    }
  };
  // Load usage stats
  useEffect(() => {
    const loadUsage = async () => {
      try {
        const { data } = await getUsage();
        setUsage(data);
      } catch (error) {
        console.error('Failed to load usage:', error);
      }
    };
    loadUsage();
  }, [result]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }
    
    // Check word limit for free users
    const wordCount = text.trim().split(/\s+/).length;
    if (!isPaidUser && wordCount > FREE_WORD_LIMIT) {
      toast.error(`Free tier is limited to ${FREE_WORD_LIMIT} words. You have ${wordCount} words.`);
      toast('Upgrade to analyze longer texts!', { icon: '👑' });
      navigate('/pricing');
      return;
    }
    
    setLoading(true);
    try {
      // Run plagiarism check first (required)
      const plagiarismRes = await checkPlagiarism(text);
      const data = plagiarismRes.data;
      setResult(data);
      
      // Run grammar check separately (optional, don't break if it fails)
      try {
        const grammarRes = await checkGrammar(text);
        setGrammarResult(grammarRes.data);
      } catch (grammarError) {
        console.warn('Grammar check failed:', grammarError.message);
        setGrammarResult(null);
      }
      
      addToHistory({ ...data, originalText: text, createdAt: new Date() });
      
      // Show success toast with usage info
      if (data.usage) {
        if (data.usage.remaining !== null && data.usage.remaining <= 5) {
          toast.success(
            `Analysis complete! ${data.usage.remaining} ${data.usage.isDaily ? 'daily ' : ''}checks remaining.`,
            { icon: '✅', duration: 3000 }
          );
        } else {
          toast.success('Analysis complete!', { icon: '✅', duration: 2000 });
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      
      if (error.response?.status === 403) {
        const { reason, redirectTo, error: message, limit } = error.response.data;
        
        if (reason === 'FREE_LIMIT_REACHED') {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">Free Limit Reached!</span>
              </div>
              <p className="text-sm text-gray-300">You have used all 5 free analyses.</p>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/pricing');
                }}
                className="mt-2 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-sm"
              >
                Upgrade Now
              </button>
            </div>
          ), { duration: 6000 });
          
        } else if (reason === 'DAILY_LIMIT_REACHED') {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="font-bold">Daily Limit Reached!</span>
              </div>
              <p className="text-sm text-gray-300">
                You have used all {limit} analyses for today.
              </p>
              <p className="text-xs text-gray-400">Come back tomorrow or upgrade your plan!</p>
            </div>
          ), { duration: 5000, icon: '⏰' });
          
        } else if (reason === 'SUBSCRIPTION_EXPIRED') {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-bold">Subscription Expired</span>
              </div>
              <p className="text-sm text-gray-300">Please renew to continue using PlagZap.</p>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/pricing');
                }}
                className="mt-2 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-sm"
              >
                Renew Subscription
              </button>
            </div>
          ), { duration: 6000 });
          
        } else if (reason === 'SUBSCRIPTION_PAUSED') {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">Subscription Paused</span>
              </div>
              <p className="text-sm text-gray-300">Your membership is currently on hold.</p>
              <p className="text-xs text-gray-400">Contact support to resume your subscription.</p>
            </div>
          ), { duration: 6000, icon: '⏸️' });
          
        } else if (reason === 'SUBSCRIPTION_SUSPENDED') {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-bold">Subscription Suspended</span>
              </div>
              <p className="text-sm text-gray-300">Your membership has been suspended.</p>
              <p className="text-xs text-gray-400">Please contact support for assistance.</p>
            </div>
          ), { duration: 6000, icon: '🚫' });
          
        } else {
          toast.error(message || 'Analysis failed. Please try again.');
        }
      } else {
        toast.error(`Analysis failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (content) => {
    setText(content);
    toast.success('File uploaded successfully!', { icon: '📄' });
  };

  const handleRewrite = () => {
    console.log('Fix Plagiarism clicked', { text, resultId: result?.id });
    if (!text) {
        toast.error('No text to fix!');
        return;
    }
    toast.loading('Opening Fixer...', { duration: 1000 });
    try {
        // Pass only necessary data to avoid serialization issues
        navigate('/rewrite', { state: { text, resultId: result?.id } });
    } catch (err) {
        console.error('Navigation error:', err);
        toast.error(`Navigation failed: ${err.message}`);
    }
  };

  // Usage display helper
  const renderUsageInfo = () => {
    if (!usage) return null;
    
    const { remaining, limit, isDaily, subscriptionTier } = usage;
    
    if (subscriptionTier === 'annual') {
      return (
        <div className="flex items-center gap-2 text-sm text-purple-400">
          <Sparkles className="h-4 w-4" />
          <span>Unlimited analyses</span>
        </div>
      );
    }
    
    if (subscriptionTier === 'free') {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Zap className="h-4 w-4" />
          <span>{remaining} of {limit} free checks remaining</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Clock className="h-4 w-4" />
        <span>{remaining !== null ? `${remaining}/${limit}` : 'Unlimited'} daily checks remaining</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 px-2 sm:px-4 pb-6 sm:pb-10 max-w-6xl mx-auto">
      {/* Promotional Banner - only for free users */}
      {!isPaidUser && <PromoBanner />}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
        {/* Input Section */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl font-bold">Content Analyzer</h2>
            {renderUsageInfo()}
          </div>
          
          <div className="bg-background/50 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Input Type Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 mb-4 bg-black/20 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
              <button
                onClick={() => setInputType('text')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  inputType === 'text' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Text</span>
                </div>
              </button>
              <button
                onClick={() => {
                  if (!isPaidUser) {
                    showPremiumBlockedMessage('File upload');
                    return;
                  }
                  setInputType('file');
                }}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  inputType === 'file' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : isPaidUser 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 cursor-not-allowed'
                }`}
                title={!isPaidUser ? 'Upgrade to use file upload' : 'Upload a file'}
              >
                 <div className="flex items-center gap-1.5 sm:gap-2">
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">File</span>
                  {!isPaidUser && <Lock className="w-3 h-3" />}
                </div>
              </button>
              <button
                onClick={() => {
                  if (!isPaidUser) {
                    showPremiumBlockedMessage('URL extraction');
                    return;
                  }
                  setInputType('url');
                }}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  inputType === 'url' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : isPaidUser 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 cursor-not-allowed'
                }`}
                title={!isPaidUser ? 'Upgrade to use URL extraction' : 'Extract from URL'}
              >
                 <div className="flex items-center gap-1.5 sm:gap-2">
                  <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>URL</span>
                  {!isPaidUser && <Lock className="w-3 h-3" />}
                </div>
              </button>
            </div>


            {/* Language Selector - Hidden on mobile to prevent overlap */}
            <div className="absolute top-6 right-6 z-10 hidden md:block">
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-3 h-3" />
                  <span>
                     {result?.language ? `Detected: ${result.language}` : 'Auto-Detect'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right p-1">
                  <div className="px-3 py-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Supported Languages</div>
                  {['English', 'Spanish', 'French', 'German', 'Hindi', 'Portuguese', 'Italian', 'Russian', 'Chinese', 'Japanese'].map(lang => (
                    <div key={lang} className="px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 rounded-lg cursor-default flex items-center justify-between">
                      {lang}
                      {lang === 'English' && <CheckCircle className="w-3 h-3 text-purple-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area */}
            {inputType === 'text' && (
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here (min 10 words)..."
                  className="w-full h-48 sm:h-64 bg-black/20 border border-white/10 rounded-xl p-3 sm:p-4 text-sm sm:text-base focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                />
                {!text && (
                    <button 
                      onClick={() => setText("The quick brown fox jumps over the lazy dog is a pangram containing many of the letters of the English alphabet. Plagiarism is the practice of taking someone else's work or ideas and passing them off as one's own.")}
                      className="absolute bottom-4 right-4 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      Load Sample Text
                    </button>
                )}
              </div>
            )}

            {inputType === 'file' && (
              <div className="h-64 flex flex-col justify-center">
                <FileUploaderCard onTextExtracted={(extractedText) => {
                  setText(extractedText);
                  setInputType('text'); // Switch to text view
                  toast.success('Text extracted from file!');
                }} />
              </div>
            )}

            {inputType === 'url' && (
              <div className="h-auto sm:h-64 flex flex-col justify-center items-center p-4 sm:p-8">
                <div className="w-full space-y-4">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <LinkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Analyze from URL</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Paste a link to fetch text from any webpage</p>
                  </div>
                  <form onSubmit={handleUrlExtract} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={extractingUrl}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {extractingUrl ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Fetch'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 flex items-center justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || !text}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-8 rounded-lg sm:rounded-xl text-sm sm:text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <><span className="hidden sm:inline">Run Plagiarism Check</span><span className="sm:hidden">Check Plagiarism</span></>}
              </button>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Analysis Result</h3>
                  <div className="bg-white/5 p-1 rounded-lg flex gap-1">
                      <button
                        onClick={() => setViewMode('highlight')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'highlight' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Highlight View
                      </button>
                      <button
                        onClick={() => setViewMode('comparison')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'comparison' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Comparison View
                      </button>
                      <button
                        onClick={() => setViewMode('grammar')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'grammar' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Grammar Check
                      </button>
                  </div>
              </div>
              
              {viewMode === 'highlight' && <HighlightTextBlock highlights={result.highlights} />}
              {viewMode === 'comparison' && <ComparisonView highlights={result.highlights} />}
              {viewMode === 'grammar' && (
                <GrammarView 
                  text={text} 
                  result={grammarResult} 
                  onApplyFixes={(issues) => {
                    // Apply fixes to text
                    let newText = text;
                    // Sort by length descending to avoid overlapping replacements
                    const sortedIssues = [...issues].sort((a, b) => 
                      b.original.length - a.original.length
                    );
                    for (const issue of sortedIssues) {
                      if (issue.original && issue.corrected) {
                        newText = newText.replace(issue.original, issue.corrected);
                      }
                    }
                    setText(newText);
                    toast.success(`Applied ${issues.length} grammar fix${issues.length > 1 ? 'es' : ''}!`);
                    // Re-run grammar check on new text
                    checkGrammar(newText).then(res => {
                      setGrammarResult(res.data);
                    }).catch(() => {});
                  }}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar / Results */}
        <div className="lg:col-span-4 space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-6 text-center">Analysis Results</h3>
              
              <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                       <span className="text-sm text-gray-400">AI Content Score</span>
                       <span className={`text-xl font-bold ${(result.aiScore || 0) > 50 ? 'text-red-400' : 'text-green-400'}`}>
                           {result.aiScore !== undefined && result.aiScore !== null ? result.aiScore : 0}%
                       </span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2 mb-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.aiScore || 0}%` }}
                        className={`h-2 rounded-full ${(result.aiScore || 0) > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                      />
                  </div>
                  <p className="text-xs text-gray-500 italic mt-2">{result.aiReason}</p>
                  
                  <div className="mt-3">
                    <button
                        onClick={handleRewrite}
                        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles className="h-3 w-3" />
                        Make Text Unique (Fix Both)
                    </button>
                    <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-xs text-yellow-400 flex items-start gap-1.5">
                            <span className="text-sm">⚠️</span>
                            <span>Please verify the rewritten text yourself. AI may make mistakes or change meaning slightly.</span>
                        </p>
                    </div>
                  </div>
              </div>

              <div className="flex justify-centercF mb-8">
                <ScoreGauge score={result.overallScore} />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-red-400">Plagiarized</span>
                  <span className="font-bold">
                    {result.highlights.filter(h => h.type === 'plagiarized').length} chunks
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <span className="text-orange-400">Paraphrased</span>
                  <span className="font-bold">
                    {result.highlights.filter(h => h.type === 'paraphrased').length} chunks
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="text-green-400">Unique</span>
                  <span className="font-bold">
                    {result.highlights.filter(h => h.type === 'safe').length} chunks
                  </span>
                </div>
              </div>

               {/* Detected Sources List */}
               <div className="mt-6">
                   <h4 className="font-bold text-sm text-gray-400 mb-3 uppercase tracking-wider">Detected Sources</h4>
                   
                   {result.matches && result.matches.length > 0 ? (
                       <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                           {result.matches.map((source, idx) => (
                               <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 text-sm">
                                   <div className="font-bold truncate mb-1" title={source.title}>{source.title || 'Unknown Source'}</div>
                                   <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs block truncate mb-2">
                                       {source.url}
                                   </a>
                                   <button 
                                       onClick={() => setCitationSource(source)}
                                       className="w-full py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                                   >
                                       <BookOpen className="w-3 h-3" />
                                       Cite Source
                                   </button>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                           <p className="text-sm text-gray-500">No external sources detected.</p>
                       </div>
                   )}
               </div>

              <div className="flex gap-3">
                <PDFDownloadLink
                    document={<AnalysisReport result={result} text={text} userName={user?.name} />}
                    fileName={`PlagZap-Report-${new Date().toISOString().slice(0,10)}.pdf`}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    {({ blob, url, loading, error }) => (
                        <>
                           {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                           {loading ? 'Generating...' : 'Report'}
                        </>
                    )}
                </PDFDownloadLink>

                <button
                    onClick={handleRewrite}
                    className="flex-1 bg-white text-black dark:bg-white dark:text-black hover:bg-gray-200 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 relative z-50 cursor-pointer"
                >
                    <Sparkles className="h-5 w-5" />
                    Fix Plagiarism
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border border-dashed border-gray-700 rounded-2xl text-gray-500 text-center">
              Run an analysis to see detailed results here.
            </div>
          )}
          
          {/* Chrome Extension Promo */}
          <a href="/plagzap-extension.zip" download="plagzap-extension.zip" className="block mt-6 group">
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-4 opacity-50">
                  <Zap className="h-16 w-16 text-blue-400 rotate-12" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                     <span className="bg-blue-500 rounded p-1"><Zap className="h-3 w-3 text-white" /></span>
                     Browser Extension
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                     Check plagiarism directly on any website without copying text.
                  </p>
                  <span className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                     Download ZIP <ArrowRight className="h-4 w-4" />
                  </span>
               </div>
            </motion.div>
          </a>
        </div>
      </div>
      
      {/* Citation Modal */}
      <CitationGenerator 
        source={citationSource} 
        isOpen={!!citationSource} 
        onClose={() => setCitationSource(null)} 
      />
    </div>
  );
};

export default Analyzer;

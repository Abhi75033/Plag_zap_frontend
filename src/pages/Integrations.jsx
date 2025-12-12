import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Plug, 
  FileText, 
  Code, 
  Cloud, 
  Globe, 
  Zap, 
  ArrowRight, 
  X, 
  Copy, 
  Check,
  Key,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getApiKey, generateApiKey } from '../services/api';

const Integrations = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyData, setApiKeyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const integrations = [
    { 
      icon: <FileText className="h-8 w-8" />,
      name: 'Google Docs',
      desc: 'Check plagiarism directly from your Google Docs with our Chrome extension.',
      status: 'available',
      color: 'blue',
      link: 'https://chrome.google.com/webstore'
    },
    { 
      icon: <Code className="h-8 w-8" />,
      name: 'VS Code',
      desc: 'Integrate plagiarism checking into your development workflow.',
      status: 'coming soon',
      color: 'purple'
    },
    { 
      icon: <Globe className="h-8 w-8" />,
      name: 'WordPress',
      desc: 'Check your blog posts before publishing with our WordPress plugin.',
      status: 'available',
      color: 'green',
      link: 'https://wordpress.org/plugins'
    },
    { 
      icon: <Cloud className="h-8 w-8" />,
      name: 'Notion',
      desc: 'Seamlessly check content in your Notion workspace.',
      status: 'coming soon',
      color: 'orange'
    },
    { 
      icon: <Zap className="h-8 w-8" />,
      name: 'Zapier',
      desc: 'Connect PlagZap with 5000+ apps using Zapier automations.',
      status: 'available',
      color: 'pink',
      link: 'https://zapier.com'
    },
    { 
      icon: <Code className="h-8 w-8" />,
      name: 'REST API',
      desc: 'Build custom integrations with our comprehensive REST API.',
      status: 'available',
      color: 'cyan',
      link: '/api-docs'
    },
  ];

  const handleLearnMore = (integration) => {
    if (integration.link) {
      if (integration.link.startsWith('/')) {
        navigate(integration.link);
      } else {
        window.open(integration.link, '_blank');
      }
    }
  };

  const handleGetApiKey = async () => {
    if (!user) {
      toast.error('Please login to get an API key');
      navigate('/login');
      return;
    }

    setShowApiKeyModal(true);
    setLoading(true);

    try {
      const { data } = await getApiKey();
      setApiKeyData(data);
    } catch (error) {
      console.error('Failed to get API key:', error);
      toast.error('Failed to get API key');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setLoading(true);
    try {
      const { data } = await generateApiKey();
      setApiKeyData({
        hasApiKey: true,
        apiKey: data.apiKey,
        fullApiKey: data.apiKey,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        isExpired: false,
        isNew: true
      });
      toast.success('API key generated! Expires in 7 days.');
    } catch (error) {
      console.error('Failed to generate API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = () => {
    const keyToCopy = apiKeyData?.fullApiKey || apiKeyData?.apiKey;
    if (keyToCopy) {
      navigator.clipboard.writeText(keyToCopy);
      setCopied(true);
      toast.success('API key copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-4 rounded-full bg-cyan-500/20 mb-6">
            <Plug className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Integrations
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect PlagZap with your favorite tools and streamline your workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-background/50 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group"
            >
              <div className="inline-flex p-3 rounded-xl bg-cyan-500/20 text-cyan-400 mb-4">
                {item.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  item.status === 'available' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
              {item.status === 'available' && (
                <button 
                  onClick={() => handleLearnMore(item)}
                  className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* API Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">Build with our API</h2>
              <p className="text-gray-400 mb-4">
                Our REST API gives you full access to PlagZap's plagiarism detection and humanization 
                capabilities. Perfect for building custom solutions.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/api-docs')}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  View API Docs
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleGetApiKey}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Get API Key
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black/50 rounded-xl p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-300">
{`curl -X POST 'https://api.plagzap.com/v1/check' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"text": "Your content here..."}'`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApiKeyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Key className="h-5 w-5 text-cyan-400" />
                  API Key
                </h3>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : apiKeyData?.hasApiKey ? (
                <div>
                  {apiKeyData.isExpired && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                      <p className="text-red-400 text-sm">
                        ⚠️ <strong>Expired:</strong> This API key has expired. Please generate a new one.
                      </p>
                    </div>
                  )}

                  <div className="bg-black/50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <code className="text-cyan-400 font-mono text-sm break-all">
                        {apiKeyData.fullApiKey || apiKeyData.apiKey}
                      </code>
                      <button
                        onClick={handleCopyApiKey}
                        className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {apiKeyData.isNew && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ <strong>Important:</strong> Store this key securely. You won't be able to see the full key again!
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-400">
                      Created: {new Date(apiKeyData.createdAt).toLocaleDateString()}
                    </p>
                    {apiKeyData.expiresAt && (
                      <p className={`text-sm ${apiKeyData.isExpired ? 'text-red-400' : 'text-gray-400'}`}>
                        Expires: {new Date(apiKeyData.expiresAt).toLocaleDateString()} 
                        {!apiKeyData.isExpired && (
                          <span className="text-green-400 ml-2">
                            ({Math.ceil((new Date(apiKeyData.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days left)
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleGenerateApiKey}
                    disabled={loading}
                    className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Key (invalidates current key)
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  {(!user?.subscriptionTier || user?.subscriptionTier === 'free') ? (
                    <>
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-8 w-8 text-yellow-400" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Upgrade Required</h4>
                      <p className="text-gray-400 mb-6">
                        API key generation is only available for paid plans. Upgrade to unlock API access and build powerful integrations.
                      </p>
                      <button
                        onClick={() => {
                          setShowApiKeyModal(false);
                          navigate('/pricing');
                        }}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Crown className="h-5 w-5" />
                        Upgrade Now
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Key className="h-8 w-8 text-cyan-400" />
                      </div>
                      <p className="text-gray-400 mb-6">
                        You don't have an API key yet. Generate one to start using the PlagZap API.
                      </p>
                      <button
                        onClick={handleGenerateApiKey}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="h-5 w-5" />
                        Generate API Key
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Integrations;

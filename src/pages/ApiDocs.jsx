import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Code, 
  Copy, 
  Check, 
  ArrowLeft,
  FileText,
  RefreshCw,
  History,
  User,
  Key,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CodeBlock = ({ language, code, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/50 rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-sm text-gray-400">{title || language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  );
};

const EndpointCard = ({ method, endpoint, description, request, response, authRequired = true }) => {
  const methodColors = {
    GET: 'bg-green-500/20 text-green-400 border-green-500/30',
    POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/50 border border-white/10 rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-lg text-white font-mono">{endpoint}</code>
        {authRequired && (
          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-lg">
            Auth Required
          </span>
        )}
      </div>
      <p className="text-gray-400 mb-4">{description}</p>
      
      {request && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Body</h4>
          <CodeBlock language="json" code={request} />
        </div>
      )}
      
      {response && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Response</h4>
          <CodeBlock language="json" code={response} />
        </div>
      )}
    </motion.div>
  );
};

const ApiDocs = () => {
  const baseUrl = 'https://api.plagzap.com/v1';

  const endpoints = [
    {
      category: 'Authentication',
      icon: <Key className="h-5 w-5" />,
      items: [
        {
          method: 'POST',
          endpoint: '/auth/register',
          description: 'Register a new user account',
          authRequired: false,
          request: JSON.stringify({
            name: "John Doe",
            email: "john@example.com",
            password: "yourpassword123"
          }, null, 2),
          response: JSON.stringify({
            token: "eyJhbGciOiJIUzI1NiIs...",
            user: {
              id: "user_123",
              name: "John Doe",
              email: "john@example.com"
            }
          }, null, 2),
        },
        {
          method: 'POST',
          endpoint: '/auth/login',
          description: 'Login to get authentication token',
          authRequired: false,
          request: JSON.stringify({
            email: "john@example.com",
            password: "yourpassword123"
          }, null, 2),
          response: JSON.stringify({
            token: "eyJhbGciOiJIUzI1NiIs...",
            user: {
              id: "user_123",
              name: "John Doe",
              subscriptionTier: "free"
            }
          }, null, 2),
        },
      ]
    },
    {
      category: 'Plagiarism Detection',
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          method: 'POST',
          endpoint: '/plagiarism/check',
          description: 'Check text for plagiarism. Returns a similarity score and detected sources.',
          request: JSON.stringify({
            text: "Your content to check for plagiarism..."
          }, null, 2),
          response: JSON.stringify({
            success: true,
            overallScore: 15,
            analysis: {
              originalPhrases: ["unique content..."],
              flaggedPhrases: ["potentially copied..."],
              sources: ["example.com"]
            }
          }, null, 2),
        },
      ]
    },
    {
      category: 'Content Rewriting',
      icon: <RefreshCw className="h-5 w-5" />,
      items: [
        {
          method: 'POST',
          endpoint: '/rewrite',
          description: 'Rewrite content to make it unique and plagiarism-free.',
          request: JSON.stringify({
            text: "Content to rewrite...",
            historyId: "optional_history_id"
          }, null, 2),
          response: JSON.stringify({
            success: true,
            rewrittenText: "Uniquely rewritten content...",
            originalScore: 45,
            newScore: 5
          }, null, 2),
        },
      ]
    },
    {
      category: 'History',
      icon: <History className="h-5 w-5" />,
      items: [
        {
          method: 'GET',
          endpoint: '/history',
          description: 'Get all plagiarism check history for the authenticated user.',
          response: JSON.stringify([
            {
              _id: "hist_123",
              originalText: "Checked content...",
              overallScore: 20,
              createdAt: "2024-01-15T10:30:00Z"
            }
          ], null, 2),
        },
      ]
    },
    {
      category: 'User & Subscription',
      icon: <User className="h-5 w-5" />,
      items: [
        {
          method: 'GET',
          endpoint: '/auth/me',
          description: 'Get current user profile and subscription details.',
          response: JSON.stringify({
            id: "user_123",
            name: "John Doe",
            email: "john@example.com",
            subscriptionTier: "monthly",
            usageCount: 45,
            canPerformAnalysis: { allowed: true, remaining: 55 }
          }, null, 2),
        },
        {
          method: 'GET',
          endpoint: '/subscriptions/usage',
          description: 'Get current usage statistics and limits.',
          response: JSON.stringify({
            tier: "monthly",
            usedToday: 10,
            dailyLimit: 100,
            totalUsed: 45
          }, null, 2),
        },
      ]
    },
  ];

  const curlExample = `curl -X POST '${baseUrl}/plagiarism/check' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"text": "Your content to check..."}'`;

  const jsExample = `const response = await fetch('${baseUrl}/plagiarism/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Your content to check...'
  })
});

const data = await response.json();
console.log(data.overallScore);`;

  const pythonExample = `import requests

response = requests.post(
    '${baseUrl}/plagiarism/check',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={'text': 'Your content to check...'}
)

data = response.json()
print(data['overallScore'])`;

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            to="/integrations"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Integrations
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <Book className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                API Documentation
              </h1>
              <p className="text-gray-400">
                Integrate PlagZap's powerful plagiarism detection into your applications
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            Quick Start
          </h2>
          <p className="text-gray-300 mb-6">
            Get started with the PlagZap API in minutes. All API requests require authentication via Bearer token.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-cyan-400 mb-1">1</div>
              <div className="font-medium text-white">Get API Key</div>
              <div className="text-sm text-gray-400">Generate from Integrations page</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-cyan-400 mb-1">2</div>
              <div className="font-medium text-white">Make Request</div>
              <div className="text-sm text-gray-400">Use Bearer token auth</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-cyan-400 mb-1">3</div>
              <div className="font-medium text-white">Get Results</div>
              <div className="text-sm text-gray-400">JSON response with score</div>
            </div>
          </div>

          <div className="text-sm text-gray-400 mb-4">
            Base URL: <code className="text-cyan-400 bg-black/30 px-2 py-1 rounded">{baseUrl}</code>
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Code className="h-6 w-6 text-purple-400" />
            Code Examples
          </h2>

          <div className="space-y-4">
            <CodeBlock language="bash" title="cURL" code={curlExample} />
            <CodeBlock language="javascript" title="JavaScript / Node.js" code={jsExample} />
            <CodeBlock language="python" title="Python" code={pythonExample} />
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>

          {endpoints.map((category, idx) => (
            <div key={idx} className="mb-10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">{category.icon}</span>
                {category.category}
              </h3>
              {category.items.map((endpoint, i) => (
                <EndpointCard key={i} {...endpoint} />
              ))}
            </div>
          ))}
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-yellow-400 mb-2">Rate Limits</h3>
          <p className="text-gray-300">
            API rate limits depend on your subscription tier. Free tier: 5 requests total. 
            Paid tiers have daily limits ranging from 100-350 requests, with Annual plans having unlimited access.
          </p>
        </motion.div>

        {/* Need Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@plagzap.com" className="text-cyan-400 hover:underline">
              support@plagzap.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocs;

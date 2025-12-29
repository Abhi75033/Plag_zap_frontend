import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Facebook, Linkedin, Copy, Check, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { blogPosts } from '../data/blogData';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Find related posts (same category, different post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = post.title;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <article className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </motion.div>

        {/* Post Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
              {post.category}
            </span>
            {post.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-400 mb-6">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>

          <p className="text-xl text-gray-300 leading-relaxed">
            {post.excerpt}
          </p>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-12 pb-8 border-b border-white/10"
        >
          <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share:
          </span>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Share on Twitter"
          >
            <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Share on Facebook"
          >
            <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Share on LinkedIn"
          >
            <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            )}
          </button>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none mb-16"
        >
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-4xl font-bold text-white mb-6 mt-12" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-white mb-4 mt-10" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-white mb-3 mt-8" {...props} />,
              p: ({ node, ...props }) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
              strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
              code: ({ node, ...props }) => <code className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded" {...props} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border-t border-white/10 pt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related, idx) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  className="group"
                >
                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{related.readTime}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;

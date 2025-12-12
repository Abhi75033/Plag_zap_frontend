import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: 'How AI is Changing Content Creation in 2024',
      excerpt: 'Explore the latest trends in AI-powered writing tools and how they are reshaping the content landscape.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      date: 'Dec 1, 2024',
      readTime: '5 min read',
      author: 'Abhishek Kumar',
      category: 'AI & Technology'
    },
    {
      title: 'The Ultimate Guide to Plagiarism Detection',
      excerpt: 'Learn everything you need to know about detecting plagiarism and maintaining content originality.',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800',
      date: 'Nov 28, 2024',
      readTime: '8 min read',
      author: 'Priya Sharma',
      category: 'Guides'
    },
    {
      title: 'Why Humanizing AI Content Matters',
      excerpt: 'Discover why making AI-generated content sound more human is crucial for engagement and authenticity.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      date: 'Nov 25, 2024',
      readTime: '6 min read',
      author: 'Rahul Verma',
      category: 'Tips & Tricks'
    },
    {
      title: 'Academic Integrity in the Age of ChatGPT',
      excerpt: 'How students and educators can navigate AI tools while maintaining academic honesty.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      date: 'Nov 20, 2024',
      readTime: '7 min read',
      author: 'Anjali Patel',
      category: 'Education'
    },
    {
      title: 'PlagZap vs Competitors: An Honest Comparison',
      excerpt: 'We compare PlagZap with other plagiarism detection tools to help you make an informed choice.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      date: 'Nov 15, 2024',
      readTime: '10 min read',
      author: 'Abhishek Kumar',
      category: 'Product'
    },
    {
      title: 'Best Practices for Content Writers Using AI',
      excerpt: 'Tips and strategies for content writers to effectively use AI tools while staying original.',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800',
      date: 'Nov 10, 2024',
      readTime: '5 min read',
      author: 'Priya Sharma',
      category: 'Writing'
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-gray-400">Insights, guides, and updates from the PlagZap team</p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img 
              src={posts[0].image} 
              alt={posts[0].title}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full mb-4 inline-block">{posts[0].category}</span>
              <h2 className="text-3xl font-bold text-white mb-4">{posts[0].title}</h2>
              <p className="text-gray-300 mb-4">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1"><User className="h-4 w-4" /> {posts[0].author}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {posts[0].date}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {posts[0].readTime}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-background/50 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-all"
            >
              <div className="overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">{post.category}</span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2 group-hover:text-purple-400 transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1 text-purple-400 font-medium group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

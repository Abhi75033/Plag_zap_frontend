import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, AlertTriangle, Lightbulb, FileText, Quote } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const HowToAvoidPlagiarism = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="How to Avoid Plagiarism in Assignments — Complete Guide & Checker"
        description="Learn how to avoid plagiarism in your assignments with our comprehensive guide. Best practices, citation tips, and free plagiarism checker included."
        keywords="how to avoid plagiarism in assignment, avoid plagiarism, prevent plagiarism, plagiarism prevention, citation guide, academic integrity"
        canonical="/how-to-avoid-plagiarism"
        schema={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Avoid Plagiarism in Assignments",
          "description": "Step-by-step guide to avoiding plagiarism in academic work",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Understand What Plagiarism Is",
              "text": "Learn to recognize different types of plagiarism including direct copying, paraphrasing without citation, and self-plagiarism"
            },
            {
              "@type": "HowToStep",
              "name": "Take Proper Notes",
              "text": "Always record sources while researching and use quotation marks for direct quotes"
            },
            {
              "@type": "HowToStep",
              "name": "Cite All Sources",
              "text": "Use proper citation format (APA, MLA, Chicago) for all referenced material"
            },
            {
              "@type": "HowToStep",
              "name": "Paraphrase Correctly",
              "text": "Rewrite ideas in your own words and still cite the original source"
            },
            {
              "@type": "HowToStep",
              "name": "Use Plagiarism Checker",
              "text": "Check your work with PlagZap before submission to catch unintentional plagiarism"
            }
          ]
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            Complete Guide
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How to <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Avoid Plagiarism</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            A comprehensive guide to maintaining academic integrity and avoiding plagiarism in your assignments, essays, and research papers.
          </p>
        </motion.div>

        {/* What is Plagiarism */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            What is Plagiarism?
          </h2>
          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/20 rounded-xl p-8">
            <p className="text-gray-300 mb-4">
              Plagiarism is the act of using someone else's work, ideas, or words without proper attribution. It's considered academic dishonesty and can have serious consequences.
            </p>
            <h3 className="font-bold text-lg mb-3">Common Types of Plagiarism:</h3>
            <ul className="space-y-2">
              {[
                'Direct Plagiarism: Copying text word-for-word without quotation marks or citation',
                'Paraphrasing Plagiarism: Rewording someone\'s ideas without giving credit',
                'Mosaic Plagiarism: Mixing copied phrases with your own words',
                'Self-Plagiarism: Reusing your own previous work without disclosure',
                'Accidental Plagiarism: Unintentionally failing to cite sources properly'
              ].map((type, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300">{type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps to Avoid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">5 Steps to Avoid Plagiarism</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Take Detailed Notes While Researching',
                icon: <FileText className="h-6 w-6" />,
                tips: [
                  'Always record the source (author, title, date, URL)',
                  'Use quotation marks for exact quotes',
                  'Clearly mark which ideas are yours vs. from sources',
                  'Keep a bibliography as you research'
                ]
              },
              {
                step: 2,
                title: 'Understand When to Cite',
                icon: <Quote className="h-6 w-6" />,
                tips: [
                  'Direct quotes always need citations',
                  'Paraphrased ideas need citations',
                  'Statistics and data need citations',
                  'Common knowledge doesn\'t need citation'
                ]
              },
              {
                step: 3,
                title: 'Learn Proper Citation Formats',
                icon: <BookOpen className="h-6 w-6" />,
                tips: [
                  'Use APA for social sciences',
                  'Use MLA for humanities',
                  'Use Chicago for history',
                  'Be consistent with one format throughout'
                ]
              },
              {
                step: 4,
                title: 'Paraphrase Correctly',
                icon: <Lightbulb className="h-6 w-6" />,
                tips: [
                  'Read and understand the original text',
                  'Put it away and write in your own words',
                  'Change sentence structure, not just words',
                  'Still cite the original source'
                ]
              },
              {
                step: 5,
                title: 'Check Your Work Before Submission',
                icon: <CheckCircle className="h-6 w-6" />,
                tips: [
                  'Use a plagiarism checker like PlagZap',
                  'Review all citations for accuracy',
                  'Ensure all quotes have quotation marks',
                  'Verify your reference list is complete'
                ]
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900/50 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </h3>
                  </div>
                </div>
                <ul className="space-y-2 ml-16">
                  {item.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Citation Examples */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Quick Citation Guide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                format: 'APA',
                example: 'Smith, J. (2024). Title of article. Journal Name, 10(2), 45-67.'
              },
              {
                format: 'MLA',
                example: 'Smith, John. "Title of Article." Journal Name, vol. 10, no. 2, 2024, pp. 45-67.'
              },
              {
                format: 'Chicago',
                example: 'Smith, John. "Title of Article." Journal Name 10, no. 2 (2024): 45-67.'
              }
            ].map((citation, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-blue-400">{citation.format}</h3>
                <code className="text-sm text-gray-300 block bg-black/40 p-3 rounded">
                  {citation.example}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid</h2>
          <div className="space-y-4">
            {[
              'Forgetting to cite paraphrased content',
              'Using too many direct quotes instead of paraphrasing',
              'Citing the wrong source (secondary instead of primary)',
              'Inconsistent citation format',
              'Missing page numbers for direct quotes',
              'Not citing images, graphs, or data'
            ].map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-red-900/10 border border-red-500/20 rounded-xl p-4">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{mistake}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl p-8 md:p-12 text-center mb-16 border border-white/10">
          <h2 className="text-3xl font-bold mb-4">Check Your Work for Plagiarism</h2>
          <p className="text-gray-400 mb-6">
            Use PlagZap to scan your assignment before submission and ensure it's 100% original
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            Check for Plagiarism Free
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowToAvoidPlagiarism;

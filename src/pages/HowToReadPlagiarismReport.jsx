import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileSearch, BarChart3, AlertCircle, CheckCircle, Info } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const HowToReadPlagiarismReport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <SEO 
        title="How to Interpret Your Plagiarism Report | Plagzap Guide"
        description="Learn how to read and interpret your plagiarism report. Understand similarity scores, matched sources, and what different colors mean in your plagiarism check results."
        keywords="how to interpret plagiarism report, how to read plagiarism report, understand plagiarism score, plagiarism report guide"
        canonical="/how-to-read-plagiarism-report"
        schema={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Read a Plagiarism Report",
          "description": "Guide to understanding and interpreting plagiarism detection reports",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Check Overall Similarity Score",
              "text": "Look at the percentage at the top - this shows how much of your text matches other sources"
            },
            {
              "@type": "HowToStep",
              "name": "Review Matched Sources",
              "text": "Examine the list of sources where matches were found"
            },
            {
              "@type": "HowToStep",
              "name": "Analyze Highlighted Text",
              "text": "Different colors indicate different sources - click to see the original"
            },
            {
              "@type": "HowToStep",
              "name": "Understand AI Detection Score",
              "text": "Check if any content is flagged as AI-generated"
            },
            {
              "@type": "HowToStep",
              "name": "Take Action",
              "text": "Add citations, paraphrase, or rewrite flagged sections"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
            <FileSearch className="h-4 w-4" />
            Understanding Your Results
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Read Your Plagiarism Report</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            A complete guide to understanding your plagiarism check results and taking the right actions to improve your content's originality.
          </p>
        </motion.div>

        {/* Understanding the Score */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            Understanding the Similarity Score
          </h2>
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-8">
            <p className="text-gray-300 mb-6">
              The similarity score is the percentage of your text that matches content found in other sources. Here's what different scores typically mean:
            </p>
            <div className="space-y-4">
              {[
                {
                  range: '0-10%',
                  color: 'green',
                  meaning: 'Excellent',
                  desc: 'Your content is highly original. Minor matches are usually common phrases or properly cited quotes.'
                },
                {
                  range: '11-25%',
                  color: 'yellow',
                  meaning: 'Good',
                  desc: 'Acceptable for most academic work. Review matches to ensure proper citations are in place.'
                },
                {
                  range: '26-50%',
                  color: 'orange',
                  meaning: 'Moderate',
                  desc: 'Needs attention. Check if matches are properly cited or need paraphrasing.'
                },
                {
                  range: '51%+',
                  color: 'red',
                  meaning: 'High Risk',
                  desc: 'Significant plagiarism detected. Requires immediate revision and proper citation.'
                }
              ].map((score, idx) => (
                <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${
                  score.color === 'green' ? 'bg-green-900/20 border-green-500/30' :
                  score.color === 'yellow' ? 'bg-yellow-900/20 border-yellow-500/30' :
                  score.color === 'orange' ? 'bg-orange-900/20 border-orange-500/30' :
                  'bg-red-900/20 border-red-500/30'
                }`}>
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold ${
                    score.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    score.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    score.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {score.range}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{score.meaning}</h3>
                    <p className="text-gray-300 text-sm">{score.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Components */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Key Components of Your Report</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Overall Similarity Percentage',
                icon: <BarChart3 className="h-6 w-6" />,
                desc: 'The main score showing total matched content',
                tips: [
                  'Displayed prominently at the top of the report',
                  'Includes all matches from all sources combined',
                  'Lower is generally better, but context matters'
                ]
              },
              {
                title: 'Matched Sources List',
                icon: <FileSearch className="h-6 w-6" />,
                desc: 'Shows where your content matches were found',
                tips: [
                  'Lists websites, papers, and documents with matches',
                  'Shows percentage match for each source',
                  'Click to view the original source'
                ]
              },
              {
                title: 'Highlighted Text',
                icon: <AlertCircle className="h-6 w-6" />,
                desc: 'Color-coded sections showing matched content',
                tips: [
                  'Different colors = different sources',
                  'Hover or click to see the matching source',
                  'Longer highlights need more attention'
                ]
              },
              {
                title: 'AI Detection Score',
                icon: <Info className="h-6 w-6" />,
                desc: 'Percentage of content likely AI-generated',
                tips: [
                  'Separate from plagiarism score',
                  'Shows probability of AI writing',
                  'Sentence-level breakdown available'
                ]
              }
            ].map((component, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900/50 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    {component.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{component.title}</h3>
                    <p className="text-gray-400 mb-3">{component.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-16">
                  {component.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What to Do Next */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What to Do After Checking Your Report</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-green-400">✓ If Score is Low (0-15%)</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Review any highlighted sections</li>
                <li>• Ensure citations are properly formatted</li>
                <li>• Check that quotes have quotation marks</li>
                <li>• You're likely good to submit!</li>
              </ul>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-red-400">⚠ If Score is High (25%+)</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Identify the largest matches first</li>
                <li>• Add proper citations where missing</li>
                <li>• Paraphrase improperly cited content</li>
                <li>• Re-check after making changes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Questions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Why is my properly cited quote flagged?',
                a: 'Plagiarism checkers highlight all matches, including properly cited quotes. This is normal - just verify your citation is correct.'
              },
              {
                q: 'What if the match is from my own previous work?',
                a: 'This is called self-plagiarism. You should cite your previous work or get permission to reuse it, depending on your institution\'s policy.'
              },
              {
                q: 'Is a 20% similarity score bad?',
                a: 'Not necessarily. It depends on your field and assignment type. Papers with many citations may naturally have higher scores. Check with your instructor.'
              },
              {
                q: 'Can I ignore matches from the reference list?',
                a: 'Yes, most checkers include references in the score. PlagZap allows you to exclude references and citations from the similarity calculation.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 md:p-12 text-center mb-16 border border-white/10">
          <h2 className="text-3xl font-bold mb-4">Check Your Content Now</h2>
          <p className="text-gray-400 mb-6">
            Get a detailed plagiarism report with PlagZap and understand exactly what needs attention
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            Get Your Report Free
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowToReadPlagiarismReport;

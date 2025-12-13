import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Volume2, Book, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { lookupDictionary } from '../services/api';

const TeamDictionary = () => {
    const [input, setInput] = useState('');
    const [targetLang, setTargetLang] = useState('Spanish');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Hindi', 'Arabic'];

    const handleLookup = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setResult(null);
        try {
            const { data } = await lookupDictionary(input, targetLang);
            setResult(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to lookup definition/translation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Book className="w-5 h-5 text-purple-400" />
                Smart Dictionary & Translator
            </h3>

            <form onSubmit={handleLookup} className="space-y-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter a word to define or a sentence to translate..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 pl-12 focus:outline-none focus:border-purple-500 transition-colors text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    
                    {/* Language Selector (Only relevant if translating likely, but kept visible for simplicity) */}
                    <div className="relative min-w-[150px]">
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="w-full h-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                        <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {loading ? 'Thinking...' : 'Lookup'}
                    </button>
                </div>
            </form>

            {/* Results Display */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/20 border border-white/10 rounded-xl p-6 relative overflow-hidden"
                >
                    {result.type === 'definition' ? (
                         // DEFINITION VIEW
                         <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    {result.word}
                                </h2>
                                <span className="text-sm px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono italic">
                                    {result.partOfSpeech}
                                </span>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Definition</h4>
                                    <p className="text-lg leading-relaxed text-gray-200">{result.definition}</p>
                                </div>

                                {result.synonyms && result.synonyms.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Synonyms</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.synonyms.map(syn => (
                                                <span key={syn} className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors cursor-default">
                                                    {syn}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.example && (
                                    <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-4 rounded-lg border-l-4 border-purple-500">
                                        <h4 className="text-sm font-bold text-purple-400 mb-1">Example</h4>
                                        <p className="text-gray-300 italic">"{result.example}"</p>
                                    </div>
                                )}
                            </div>
                         </div>
                    ) : (
                        // TRANSLATION VIEW
                        <div>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Original ({result.detectedLanguage || 'Detected'})</h4>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-lg text-gray-300">
                                        {result.original}
                                    </div>
                                </div>
                                
                                <div className="flex justify-center">
                                    <ArrowRight className="w-6 h-6 text-gray-500 hidden md:block" />
                                    <ArrowRight className="w-6 h-6 text-gray-500 md:hidden rotate-90 my-2" />
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">Translated ({result.targetLanguage})</h4>
                                    <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-xl font-medium text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                        {result.translated}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
            
             <p className="text-xs text-gray-500 mt-6 text-center">
                Powered by Gemini AI • Context-aware Definitions & Translations
            </p>
        </div>
    );
};

export default TeamDictionary;

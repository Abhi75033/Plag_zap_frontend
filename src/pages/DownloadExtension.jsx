import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Shield, Zap, Globe } from 'lucide-react';

const DownloadExtension = () => {
  return (
    <div className="min-h-screen pt-24 px-4 pb-10 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-6 border border-white/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
             <Zap className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          PlagZap for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Chrome</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Check for plagiarism and AI content instantly while browsing the web. 
          No need to copy-paste anymore.
        </p>
        
        <div className="flex justify-center gap-4">
          <a 
            href="/plagzap-extension.zip" 
            download="plagzap-extension.zip"
            className="px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-xl"
          >
             <Globe className="w-5 h-5" />
             <span>Download Extension ZIP</span>
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-purple-400" />
                Installation Guide
            </h3>
            
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">1</div>
                    <div>
                        <h4 className="font-bold mb-1">Locate the Folder</h4>
                        <p className="text-gray-400 text-sm">
                            The extension is already in your project folder under: <br/>
                            <code className="bg-black/50 px-2 py-1 rounded text-purple-300 mt-1 block w-fit text-xs">/Desktop/Plagrism/extension</code>
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">2</div>
                    <div>
                        <h4 className="font-bold mb-1">Open Chrome Extensions</h4>
                        <p className="text-gray-400 text-sm">
                            Type <code className="bg-black/50 px-2 py-1 rounded text-gray-300 text-xs">chrome://extensions</code> in your browser addres bar.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">3</div>
                    <div>
                        <h4 className="font-bold mb-1">Enable Developer Mode</h4>
                        <p className="text-gray-400 text-sm">
                            Toggle the "Developer mode" switch in the top right corner of the page.
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">4</div>
                    <div>
                        <h4 className="font-bold mb-1">Load Unpacked</h4>
                        <p className="text-gray-400 text-sm">
                            Click "Load unpacked" (top left) and select the <code className="text-purple-300">extension</code> folder.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
             <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                    <Zap className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2">Instant Analysis</h4>
                    <p className="text-gray-400 text-sm">Scan any webpage content with a single click. No copy-pasting required.</p>
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2">Secure & Private</h4>
                    <p className="text-gray-400 text-sm">The extension uses your secure login token. Your data remains private.</p>
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2">AI & Plagiarism Detection</h4>
                    <p className="text-gray-400 text-sm">Get the same powerful dual-detection engine directly in your browser.</p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadExtension;

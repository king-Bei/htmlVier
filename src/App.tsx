/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Code2, Eye, Copy, Trash2, Download, Share2, Layout, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [html, setHtml] = useState<string>(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }
    h1 { font-size: 3rem; margin-bottom: 1rem; }
    p { font-size: 1.25rem; opacity: 0.9; }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World!</h1>
    <p>This is your real-time HTML preview.</p>
    <p>Try changing the code on the left!</p>
  </div>
</body>
</html>`);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const updatePreview = () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(html);
          doc.close();
        }
      }
    };

    const timeoutId = setTimeout(updatePreview, 300);
    return () => clearTimeout(timeoutId);
  }, [html]);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
  };

  const handleClear = () => {
    setHtml('');
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Live HTML <span className="text-indigo-400">Previewer</span></h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
            title="Copy Code"
          >
            <Copy size={18} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
            title="Download HTML"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={handleClear}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
          <div className="w-px h-6 bg-slate-800 mx-2" />
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all shadow-lg shadow-indigo-500/20 text-sm font-medium"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Section */}
        <motion.section 
          initial={false}
          animate={{ width: isFullscreen ? '0%' : '50%', opacity: isFullscreen ? 0 : 1 }}
          className="h-full border-r border-slate-800 flex flex-col bg-[#0f172a]"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
              <Layout size={14} />
              HTML Editor
            </div>
            <div className="text-[10px] text-slate-500 font-mono">index.html</div>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="flex-1 w-full p-6 bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 selection:bg-indigo-500/30"
            spellCheck={false}
            placeholder="Paste your HTML here..."
          />
        </motion.section>

        {/* Preview Section */}
        <motion.section 
          animate={{ width: isFullscreen ? '100%' : '50%' }}
          className="h-full flex flex-col bg-white"
        >
          {!isFullscreen && (
            <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200 text-slate-600">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
                <Eye size={14} />
                Live Preview
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
            </div>
          )}
          <div className="flex-1 relative bg-white">
            <iframe
              ref={iframeRef}
              title="preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </motion.section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-900 flex items-center justify-between px-4 text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>HTML5</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{html.length} characters</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync Active
          </span>
        </div>
      </footer>
    </div>
  );
}

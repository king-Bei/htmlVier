/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Code2, Eye, Copy, Trash2, Download, Layout, Maximize2, Minimize2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Github, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HTMLHint } from 'htmlhint';

// GitHub Corner Component
const GitHubCorner = ({ url }: { url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="absolute top-0 right-0 z-50 group" aria-label="View source on GitHub">
    <svg width="80" height="80" viewBox="0 0 250 250" className="fill-indigo-600 text-slate-900 transition-all duration-300 group-hover:fill-indigo-500" aria-hidden="true">
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
      <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm"></path>
      <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.3 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.9 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path>
    </svg>
  </a>
);

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
  const [errors, setErrors] = useState<any[]>([]);
  const [showErrorPanel, setShowErrorPanel] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const validateHtml = () => {
      const results = HTMLHint.verify(html, {
        "tagname-lowercase": true,
        "attr-lowercase": true,
        "attr-value-double-quotes": true,
        "doctype-first": true,
        "tag-pair": true,
        "spec-char-escape": true,
        "id-unique": true,
        "src-not-empty": true,
        "attr-no-duplication": true,
        "title-require": false
      });
      setErrors(results);
    };

    const timeoutId = setTimeout(() => {
      updatePreview();
      validateHtml();
    }, 300);
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

  const scrollToLine = (line: number) => {
    if (textareaRef.current) {
      const lines = html.split('\n');
      let charPos = 0;
      for (let i = 0; i < line - 1; i++) {
        charPos += lines[i].length + 1;
      }
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(charPos, charPos + lines[line - 1].length);
      
      const lineHeight = 20;
      textareaRef.current.scrollTop = (line - 5) * lineHeight;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden relative">
      <GitHubCorner url="https://github.com" />

      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Live HTML <span className="text-indigo-400">Previewer</span></h1>
        </div>
        
        <div className="flex items-center gap-2 pr-16">
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
          className="h-full border-r border-slate-800 flex flex-col bg-[#0f172a] relative"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
              <Layout size={14} />
              HTML Editor
            </div>
            <div className="flex items-center gap-3">
              {errors.length > 0 ? (
                <button 
                  onClick={() => setShowErrorPanel(!showErrorPanel)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider"
                >
                  <AlertCircle size={12} />
                  {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
                  {showErrorPanel ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                  <CheckCircle2 size={12} />
                  Valid HTML
                </div>
              )}
              <div className="text-[10px] text-slate-500 font-mono">index.html</div>
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden relative">
            <div className="w-12 bg-slate-900/30 border-r border-slate-800/50 flex flex-col items-end pr-3 py-6 text-[10px] font-mono text-slate-600 select-none">
              {html.split('\n').map((_, i) => (
                <div key={i} className="h-5 leading-5">{i + 1}</div>
              ))}
            </div>
            
            <textarea
              ref={textareaRef}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="flex-1 p-6 bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 selection:bg-indigo-500/30 leading-5"
              spellCheck={false}
              placeholder="Paste your HTML here..."
            />
          </div>

          <AnimatePresence>
            {showErrorPanel && errors.length > 0 && (
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-rose-500/30 z-20 max-h-60 overflow-y-auto"
              >
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Syntax Issues</span>
                  <button onClick={() => setShowErrorPanel(false)} className="text-slate-500 hover:text-white">
                    <ChevronDown size={14} />
                  </button>
                </div>
                <div className="p-2">
                  {errors.map((err, i) => (
                    <button 
                      key={i}
                      onClick={() => scrollToLine(err.line)}
                      className="w-full text-left p-2 hover:bg-slate-800 rounded flex items-start gap-3 group transition-colors"
                    >
                      <div className="mt-1 text-rose-500">
                        <AlertCircle size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-slate-300 group-hover:text-white transition-colors">
                          {err.message}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Line {err.line}, Column {err.col} • <span className="text-slate-600 font-mono">{err.rule.id}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

      {/* AI Studio Banner Section */}
      <section className="bg-indigo-900/20 border-t border-slate-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Built with AI Studio
          </h2>
          <p className="text-sm text-slate-400">The fastest path from prompt to production with Gemini.</p>
        </div>
        <a 
          href="https://ai.studio/build" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-2 bg-white text-indigo-900 rounded-full font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/10"
        >
          Start building
          <ExternalLink size={14} />
        </a>
      </section>

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

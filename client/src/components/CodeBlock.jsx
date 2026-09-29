import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Info, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { highlightCode } from '../utils/prismHelper';

export const CodeBlock = ({
  code = '',
  language = 'python',
  fileName = 'snippet',
  explanation = '',
  annotations = [],
  simulatedOutput = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'output'
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);

  const lines = code.trim().split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Map annotations by line number
  const annotationMap = (annotations || []).reduce((acc, curr) => {
    acc[curr.line] = curr;
    return acc;
  }, {});

  const hasAnnotations = annotations && annotations.length > 0;
  const hasOutput = Boolean(simulatedOutput);

  return (
    <div className="my-6 rounded-xl border border-slate-800 bg-[#0d131f] overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono font-medium text-slate-300">
            {fileName}
          </span>
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-slate-800 text-sky-400 border border-slate-700/60">
            {language}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {hasOutput && (
            <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'code'
                    ? 'bg-slate-800 text-sky-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('output')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'output'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Output</span>
              </button>
            </div>
          )}

          {hasAnnotations && activeTab === 'code' && (
            <button
              type="button"
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                showAnnotations
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle line-by-line annotations"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Line Breakdown</span>
              {showAnnotations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Code View */}
      {activeTab === 'code' ? (
        <div className="relative overflow-x-auto p-4 text-sm font-mono leading-relaxed">
          <div className="min-w-full">
            {lines.map((lineText, index) => {
              const lineNum = index + 1;
              const annotation = annotationMap[lineNum];
              const isSelected = selectedLine === lineNum || showAnnotations;

              return (
                <div key={lineNum} className="group flex flex-col">
                  <div
                    onClick={() => {
                      if (annotation) {
                        setSelectedLine(selectedLine === lineNum ? null : lineNum);
                      }
                    }}
                    className={`flex items-start rounded px-2 -mx-2 transition-colors ${
                      annotation ? 'cursor-pointer hover:bg-slate-800/60' : ''
                    } ${
                      isSelected && annotation ? 'bg-indigo-950/40 border-l-2 border-indigo-400' : ''
                    }`}
                  >
                    {/* Line Number */}
                    <span
                      className={`w-9 shrink-0 select-none text-right pr-4 text-xs font-mono transition-colors ${
                        annotation
                          ? 'text-indigo-400 font-semibold'
                          : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    >
                      {lineNum}
                    </span>

                    {/* Annotated Indicator Dot */}
                    {annotation && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5 mr-2 animate-pulse" />
                    )}

                    {/* Syntax Highlighted Line */}
                    <span
                      className="grow whitespace-pre"
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(lineText, language) || '&nbsp;',
                      }}
                    />
                  </div>

                  {/* Inline Expandable Annotation Callout */}
                  {annotation && isSelected && (
                    <div className="my-1.5 ml-11 mr-2 p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 shadow-md">
                      <div className="flex items-center space-x-2 font-semibold text-indigo-300 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-indigo-500/30 text-indigo-200">
                          {annotation.tag || 'Insight'}
                        </span>
                        <span>Line {lineNum} Walkthrough</span>
                      </div>
                      <p className="text-slate-300 font-sans leading-normal">
                        {annotation.note}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Simulated Terminal Output View */
        <div className="p-4 bg-[#080b11] font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-slate-800/80 text-slate-500">
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulated execution environment — {fileName}</span>
          </div>
          <div className="text-emerald-400 font-medium mb-1">$ {language} {fileName}</div>
          <pre className="text-slate-200 whitespace-pre-wrap font-mono">
            {simulatedOutput}
          </pre>
        </div>
      )}

      {/* Code Explanation Footer */}
      {explanation && (
        <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 font-sans flex items-start space-x-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <span>{explanation}</span>
        </div>
      )}
    </div>
  );
};

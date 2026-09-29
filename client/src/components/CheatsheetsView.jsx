import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Code2,
  Terminal,
  Zap,
  Shield,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { cheatsheetsData } from '../data/cheatsheetsData';

export const CheatsheetsView = ({
  onSelectTrack = () => {},
}) => {
  const [selectedLang, setSelectedLang] = useState(cheatsheetsData[0]?.slug || 'python');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const activeSheet = cheatsheetsData.find((s) => s.slug === selectedLang) || cheatsheetsData[0];

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-10">
      {/* Header Banner (CodeWithHarry Cheatsheet Style) */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Developer Cheatsheets & Quick Reference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Language Cheatsheets
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Condensed syntax, memory patterns, idioms, and code snippets curated for fast reference.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Print / Save PDF</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectTrack(activeSheet.slug)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-slate-950 hover:bg-sky-400 transition-all shadow-md"
          >
            <span>Full {activeSheet.language} Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Language Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {cheatsheetsData.map((sheet) => {
          const isSelected = sheet.slug === selectedLang;
          return (
            <button
              key={sheet.slug}
              type="button"
              onClick={() => setSelectedLang(sheet.slug)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-800 text-white border-2 border-emerald-400/80 shadow-lg'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: sheet.color }}
              />
              <span>{sheet.language}</span>
              <span className="text-[10px] text-slate-500 font-mono">({sheet.version})</span>
            </button>
          );
        })}
      </div>

      {/* Active Language Cheatsheet Content */}
      <div className="space-y-8">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>{activeSheet.language} Reference Guide</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeSheet.category}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">{activeSheet.description}</p>
          </div>
        </div>

        {/* Cheatsheet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeSheet.sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="rounded-2xl border border-slate-800 bg-[#0d131f] overflow-hidden shadow-xl"
            >
              <div className="px-5 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {section.title}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {section.items.length} items
                </span>
              </div>

              <div className="p-4 space-y-4 divide-y divide-slate-800/60">
                {section.items.map((item, iIdx) => {
                  const copyKey = `${sIdx}_${iIdx}`;
                  const isCopied = copiedIndex === copyKey;

                  return (
                    <div key={iIdx} className={iIdx > 0 ? 'pt-4' : ''}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-emerald-400">
                          {item.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.code, copyKey)}
                          className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700/60 transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-sky-200 overflow-x-auto whitespace-pre leading-relaxed">
                        {item.code}
                      </pre>

                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

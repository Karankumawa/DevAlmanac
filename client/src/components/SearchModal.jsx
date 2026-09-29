import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FileCode,
  BookOpen,
  ArrowRight,
  Code2,
  Sparkles,
  Command,
} from 'lucide-react';
import { api } from '../services/api';

export const SearchModal = ({
  isOpen = false,
  onClose = () => {},
  onSelectLesson = () => {},
  tracks = [],
}) => {
  const [query, setQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.search(query, selectedTrack);
        setResults(res.data || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selectedTrack]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected && selected.track) {
          onSelectLesson(selected.track.slug, selected.slug);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectLesson]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-sky-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, syntax, memory models, pointers, channels..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-slate-800 border border-slate-700 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 px-4 py-2 bg-[#090d16] border-b border-slate-800/80 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1 shrink-0">Filter:</span>
          <button
            type="button"
            onClick={() => setSelectedTrack('')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedTrack === ''
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Tracks
          </button>
          {tracks.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setSelectedTrack(t.slug === selectedTrack ? '' : t.slug)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                selectedTrack === t.slug
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/50">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-slate-400">
              <div className="inline-block w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-2" />
              <div>Searching DevAlmanac...</div>
            </div>
          ) : results.length > 0 ? (
            results.map((result, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={result._id}
                  onClick={() => {
                    if (result.track) {
                      onSelectLesson(result.track.slug, result.slug);
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border border-sky-500/30'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: result.track?.color || '#38bdf8' }}
                      />
                      <span className="text-xs font-semibold text-sky-400">
                        {result.track?.name}
                      </span>
                      {result.module && (
                        <>
                          <span className="text-slate-600 text-xs">/</span>
                          <span className="text-xs text-slate-400">{result.module.title}</span>
                        </>
                      )}
                    </div>
                    {result.module?.difficulty && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-850 text-slate-300 border border-slate-700/60">
                        {result.module.difficulty}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center justify-between">
                    <span>{result.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100" />
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {result.overview}
                  </p>

                  {/* Matched Code Snippet Preview */}
                  {result.matchedSnippet && (
                    <div className="mt-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300">
                      <div className="flex items-center space-x-1 text-slate-500 mb-1 text-[10px]">
                        <FileCode className="w-3 h-3 text-sky-400" />
                        <span>{result.matchedSnippet.fileName}</span>
                      </div>
                      <code className="text-sky-300 block truncate">
                        {result.matchedSnippet.sample}
                      </code>
                    </div>
                  )}
                </div>
              );
            })
          ) : query ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
              <div>No lessons or code snippets match "<span className="text-slate-300">{query}</span>"</div>
              <div className="text-xs text-slate-600 mt-1">Try searching for concepts like "pointers", "ownership", "memory", "async", "channels"</div>
            </div>
          ) : (
            /* Suggested searches */
            <div className="p-4 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Suggested Topics
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Pointer Arithmetic',
                  'Asyncio Event Loop',
                  'Rust Ownership',
                  'Go Goroutines & Channels',
                  'Struct Padding & Memory',
                  'Python PyObject Descriptors',
                ].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setQuery(topic)}
                    className="p-2 text-left rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-850 text-xs text-slate-300 transition-colors truncate"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls info */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">↵</kbd> to select
            </span>
          </div>
          <span>DevAlmanac Search Engine</span>
        </div>
      </div>
    </div>
  );
};

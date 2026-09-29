import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Zap,
  Shield,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Compass,
  Search,
  Download,
  Flame,
  FileText,
  Star,
} from 'lucide-react';

export const TrackOverview = ({
  tracks = [],
  progressMap = {},
  onSelectTrack = () => {},
  onOpenSearch = () => {},
  onSelectView = () => {},
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'handbooks' | 'cheatsheets'

  const getTrackIcon = (iconName, color) => {
    switch (iconName) {
      case 'python':
        return <Code2 className="w-7 h-7" style={{ color }} />;
      case 'terminal':
        return <Terminal className="w-7 h-7" style={{ color }} />;
      case 'zap':
        return <Zap className="w-7 h-7" style={{ color }} />;
      case 'shield':
        return <Shield className="w-7 h-7" style={{ color }} />;
      default:
        return <BookOpen className="w-7 h-7" style={{ color }} />;
    }
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-10">
      {/* 1. Hero Section (Inspired by CodeWithHarry Course & W3Schools Hero) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#11192e] to-[#0a0e1a] border border-slate-800 p-8 sm:p-12 mb-12 shadow-2xl text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-sky-500/10 blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs text-sky-400 font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Open Developer Almanac • Free & Production-Ready</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Learn Code From <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Syntax to Systems
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
          Comprehensive, structured developer notes, step-by-step code walkthroughs,
          real-world memory models, common pitfalls, and interactive coding challenges.
        </p>

        {/* Quick Search Bar */}
        <div className="flex justify-center max-w-xl mx-auto mb-8">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-sky-500/50 text-slate-400 hover:text-slate-200 text-sm shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-3">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              <span>Search topics, pointers, goroutines, ownership, memory...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-xs font-mono">
              ⌘K / Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Stats Highlights Bar (CodeWithHarry Course Stats Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800/80 text-center">
          <div>
            <div className="text-2xl font-extrabold text-white">4+</div>
            <div className="text-xs text-slate-400 font-medium">Full Tracks</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-sky-400">100%</div>
            <div className="text-xs text-slate-400 font-medium">Free Access</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-400">Step-by-Step</div>
            <div className="text-xs text-slate-400 font-medium">Code Breakdowns</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-purple-400">Live</div>
            <div className="text-xs text-slate-400 font-medium">Try It Sandboxes</div>
          </div>
        </div>
      </div>

      {/* 2. Category Switcher Tabs (CodeWithHarry Notes style: Handbooks, Notes, Cheatsheets) */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            All Tracks & Courses
          </button>
          <button
            type="button"
            onClick={() => onSelectView('notes')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 transition-all flex items-center space-x-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Handbooks & Notes</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectView('cheatsheets')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 transition-all flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cheatsheets</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSelectView('playground')}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Interactive Playground</span>
        </button>
      </div>

      {/* 3. Language Learning Track Cards (GeeksforGeeks + CodeWithHarry Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {tracks.map((track) => {
          const trackProgress = progressMap[track._id] || { completedCount: 0, percentage: 0 };
          const total = track.lessonCount || 0;

          return (
            <div
              key={track._id || track.slug}
              className="rounded-2xl bg-[#0d131f] border border-slate-800 hover:border-sky-500/40 p-6 flex flex-col justify-between transition-all group shadow-xl hover:shadow-2xl"
            >
              <div>
                {/* Card Header with circular icon (CodeWithHarry Notes style) */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${track.color || '#38bdf8'}15`,
                        borderColor: `${track.color || '#38bdf8'}35`,
                      }}
                    >
                      {getTrackIcon(track.icon, track.color || '#38bdf8')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                        {track.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-mono">{track.moduleCount || 0} Modules</span>
                        <span>•</span>
                        <span className="font-mono">{total} Lessons</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-sky-400 border border-slate-800 shrink-0">
                    {track.badgeText || 'Curriculum'}
                  </span>
                </div>

                {/* Card Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                  {track.description}
                </p>

                {/* Difficulty Tiers */}
                {track.difficulties && track.difficulties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {track.difficulties.map((diff) => (
                      <span
                        key={diff}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        {diff}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress & Multi-Action Buttons (CodeWithHarry Notes style) */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Your Progress</span>
                    <span className="font-mono text-sky-400 font-bold">
                      {trackProgress.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${trackProgress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Dual Actions: Start Track & Notes */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectTrack(track.slug)}
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    <span>Start Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectView('cheatsheets')}
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-850 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cheatsheet</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. GoalKicker & Handbooks Showcase Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-[#0d131f] border border-purple-500/20 shadow-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Developer Handbooks Series</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            GoalKicker-Style Handbooks & Offline Notes
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Need condensed chapter notes for quick interview prep or systems architecture reviews? Explore our structured handbooks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectView('notes')}
          className="shrink-0 px-5 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center space-x-2"
        >
          <span>Explore All Handbooks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

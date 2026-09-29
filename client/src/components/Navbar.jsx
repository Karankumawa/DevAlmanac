import React from 'react';
import {
  BookOpen,
  Search,
  Code2,
  Menu,
  ChevronDown,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const Navbar = ({
  tracks = [],
  activeTrack = null,
  onSelectTrack = () => {},
  onOpenSearch = () => {},
  onToggleMobileMenu = () => {},
  onGoHome = () => {},
  progress = null,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu hamburger toggle */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <div
            onClick={onGoHome}
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-sky-400 transition-colors">
                  Dev<span className="text-sky-400">Almanac</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  v1.0
                </span>
              </div>
              <span className="hidden lg:block text-[11px] text-slate-400 font-medium">
                From Syntax to Systems
              </span>
            </div>
          </div>
        </div>

        {/* Center: Track Switcher Selector */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="relative group">
            <button
              type="button"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-sm font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-850 transition-all"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeTrack?.color || '#38bdf8' }} />
              <span>{activeTrack?.name || 'Select Track'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-1 w-56 rounded-xl bg-[#0f172a] border border-slate-800 shadow-2xl py-1.5 hidden group-hover:block transition-all z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Language Tracks
              </div>
              {tracks.map((track) => {
                const isSelected = activeTrack?.slug === track.slug;
                return (
                  <button
                    key={track._id || track.slug}
                    type="button"
                    onClick={() => onSelectTrack(track.slug)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-sky-500/10 text-sky-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: track.color || '#38bdf8' }}
                      />
                      <span>{track.name}</span>
                    </div>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-sky-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Search Bar & Global Progress */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800/90 hover:border-sky-500/40 text-slate-400 hover:text-slate-200 text-xs transition-all w-36 sm:w-56 justify-between group shadow-inner"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
              <span className="truncate">Search almanac...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 text-slate-400 rounded border border-slate-800">
              <span className="text-[10px]">Ctrl</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Track Completion Badge */}
          {progress && progress.totalLessons > 0 && (
            <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">
                {progress.completedCount}/{progress.totalLessons} Completed
              </span>
              <span className="text-emerald-400 font-bold font-mono">
                {progress.percentage}%
              </span>
            </div>
          )}

          {/* GitHub link / Documentation */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

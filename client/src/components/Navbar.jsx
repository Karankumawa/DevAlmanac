import React, { useState, useEffect } from 'react';
import {
  Code2,
  Search,
  Menu,
  ChevronDown,
  Sparkles,
  CheckCircle,
  BookOpen,
  FileText,
  Flame,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar = ({
  tracks = [],
  activeTrack = null,
  onSelectTrack = () => {},
  onOpenSearch = () => {},
  onToggleMobileMenu = () => {},
  onGoHome = () => {},
  currentView = 'tracks',
  onSelectView = () => {},
  progress = null,
}) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo (CodeWithHarry </> style) */}
          <div
            onClick={onGoHome}
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center font-mono font-bold text-sky-400 text-sm">
                &lt;/&gt;
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-sky-400 transition-colors">
                Dev<span className="text-sky-400">Almanac</span>
              </span>
              <span className="hidden lg:block text-[10px] text-slate-400 font-medium">
                Syntax to Systems
              </span>
            </div>
          </div>
        </div>

        {/* Center: Main Navigation Links (CodeWithHarry / GeeksforGeeks navigation) */}
        <nav className="hidden lg:flex items-center space-x-1">
          <button
            type="button"
            onClick={() => onSelectView('tracks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'tracks'
                ? 'bg-sky-500/15 text-sky-300 font-bold border border-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Learning Tracks
          </button>

          <button
            type="button"
            onClick={() => onSelectView('notes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'notes'
                ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Notes & Handbooks
          </button>

          <button
            type="button"
            onClick={() => onSelectView('cheatsheets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'cheatsheets'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Cheatsheets
          </button>

          <button
            type="button"
            onClick={() => onSelectView('playground')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentView === 'playground'
                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Try It Yourself</span>
          </button>
        </nav>

        {/* Right: Search Bar, Progress & Theme Toggle */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Search */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 text-slate-400 hover:text-slate-200 text-xs transition-all w-36 sm:w-52 justify-between group shadow-inner"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
              <span className="truncate">Search notes, code...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 text-slate-400 rounded border border-slate-800">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Track Progress Badge */}
          {progress && progress.totalLessons > 0 && (
            <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">
                {progress.completedCount}/{progress.totalLessons}
              </span>
              <span className="text-emerald-400 font-bold font-mono">
                {progress.percentage}%
              </span>
            </div>
          )}

          {/* Theme Toggle Button (CodeWithHarry style) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub link */}
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

import React, { useEffect, useState } from 'react';
import {
  List,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Compass,
  Trophy,
  ArrowUp,
} from 'lucide-react';

export const TableOfContents = ({
  headings = [],
  activeHeading = '',
  onHeadingClick = () => {},
  isCompleted = false,
  onToggleComplete = () => {},
  hasPitfalls = false,
  hasChallenge = false,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track window scroll progress percentage
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(
          100,
          Math.max(0, Math.round((window.scrollY / totalHeight) * 100))
        );
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:block h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-l border-slate-800/80 bg-[#0b0f19]/80 p-4 select-none">
      <div className="space-y-6">
        {/* Reading Progress Indicator */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-400">Reading Progress</span>
            <span className="text-sky-400 font-mono font-bold">{scrollProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Table of Contents Navigation */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            <List className="w-3.5 h-3.5 text-sky-400" />
            <span>On This Page</span>
          </div>

          <nav className="space-y-1 text-xs">
            {/* Overview Anchor */}
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                onHeadingClick('overview');
              }}
              className={`block px-2.5 py-1.5 rounded-lg transition-colors truncate ${
                activeHeading === 'overview'
                  ? 'bg-sky-500/10 text-sky-400 font-semibold border-l-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              1. Concept Overview
            </a>

            {/* Extracted Markdown Headings */}
            {headings.map((item, idx) => (
              <a
                key={item.id || idx}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onHeadingClick(item.id);
                }}
                className={`block py-1.5 rounded-lg transition-colors truncate ${
                  item.level === 3 ? 'pl-6 pr-2 text-[11px]' : 'px-2.5'
                } ${
                  activeHeading === item.id
                    ? 'bg-sky-500/10 text-sky-400 font-semibold border-l-2 border-sky-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {item.text}
              </a>
            ))}

            {/* Code Walkthrough Anchor */}
            <a
              href="#code-walkthrough"
              onClick={(e) => {
                e.preventDefault();
                onHeadingClick('code-walkthrough');
              }}
              className={`block px-2.5 py-1.5 rounded-lg transition-colors truncate ${
                activeHeading === 'code-walkthrough'
                  ? 'bg-sky-500/10 text-sky-400 font-semibold border-l-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              Code Walkthrough
            </a>

            {/* Pitfalls Anchor */}
            {hasPitfalls && (
              <a
                href="#common-pitfalls"
                onClick={(e) => {
                  e.preventDefault();
                  onHeadingClick('common-pitfalls');
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors truncate ${
                  activeHeading === 'common-pitfalls'
                    ? 'bg-amber-500/10 text-amber-400 font-semibold border-l-2 border-amber-400'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-850'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">Common Pitfalls</span>
              </a>
            )}

            {/* Practice Challenge Anchor */}
            {hasChallenge && (
              <a
                href="#practice-challenge"
                onClick={(e) => {
                  e.preventDefault();
                  onHeadingClick('practice-challenge');
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors truncate ${
                  activeHeading === 'practice-challenge'
                    ? 'bg-indigo-500/10 text-indigo-400 font-semibold border-l-2 border-indigo-400'
                    : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-850'
                }`}
              >
                <Trophy className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">Practice Challenge</span>
              </a>
            )}
          </nav>
        </div>

        {/* Quick Completion Action */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onToggleComplete}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-900 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}
            />
            <span>{isCompleted ? 'Lesson Completed' : 'Mark as Completed'}</span>
          </button>
        </div>

        {/* Back to top button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="w-full flex items-center justify-center space-x-1 py-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowUp className="w-3 h-3" />
          <span>Scroll to Top</span>
        </button>
      </div>
    </aside>
  );
};

import React from 'react';
import {
  Code2,
  Terminal,
  Zap,
  Shield,
  FileCode,
  Flame,
  Binary,
  Layers,
} from 'lucide-react';

export const LanguageRibbon = ({
  tracks = [],
  activeTrackSlug = '',
  onSelectTrack = () => {},
  currentView = 'tracks', // 'tracks' | 'notes' | 'cheatsheets' | 'playground'
  onSelectView = () => {},
}) => {
  const getIcon = (iconName, color) => {
    switch (iconName) {
      case 'python':
        return <Code2 className="w-3.5 h-3.5" style={{ color }} />;
      case 'terminal':
        return <Terminal className="w-3.5 h-3.5" style={{ color }} />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5" style={{ color }} />;
      case 'shield':
        return <Shield className="w-3.5 h-3.5" style={{ color }} />;
      default:
        return <FileCode className="w-3.5 h-3.5" style={{ color }} />;
    }
  };

  return (
    <div className="w-full bg-[#0b101c] border-b border-slate-800/80 sticky top-16 z-30 shadow-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar py-1.5 gap-2">
        {/* Language Track Links (W3Schools style quick-switcher) */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
            Languages:
          </span>

          {tracks.map((track) => {
            const isActive = activeTrackSlug === track.slug && currentView === 'tracks';

            return (
              <button
                key={track._id || track.slug}
                type="button"
                onClick={() => {
                  onSelectView('tracks');
                  onSelectTrack(track.slug);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {getIcon(track.icon, track.color || '#38bdf8')}
                <span>{track.name}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Mode Pills (CodeWithHarry & GoalKicker style) */}
        <div className="flex items-center space-x-1 shrink-0 pl-3 border-l border-slate-800">
          <button
            type="button"
            onClick={() => onSelectView('notes')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'notes'
                ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Handbooks & Notes
          </button>

          <button
            type="button"
            onClick={() => onSelectView('cheatsheets')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'cheatsheets'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Cheatsheets
          </button>

          <button
            type="button"
            onClick={() => onSelectView('playground')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
              currentView === 'playground'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Try It Yourself</span>
          </button>
        </div>
      </div>
    </div>
  );
};

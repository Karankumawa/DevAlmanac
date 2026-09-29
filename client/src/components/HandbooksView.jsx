import React from 'react';
import {
  BookOpen,
  Download,
  ArrowRight,
  FileCode,
  CheckCircle,
  ExternalLink,
  Code2,
  Terminal,
  Zap,
  Shield,
} from 'lucide-react';

export const HandbooksView = ({
  tracks = [],
  onSelectTrack = () => {},
}) => {
  const getIcon = (iconName, color) => {
    switch (iconName) {
      case 'python':
        return <Code2 className="w-8 h-8" style={{ color }} />;
      case 'terminal':
        return <Terminal className="w-8 h-8" style={{ color }} />;
      case 'zap':
        return <Zap className="w-8 h-8" style={{ color }} />;
      case 'shield':
        return <Shield className="w-8 h-8" style={{ color }} />;
      default:
        return <BookOpen className="w-8 h-8" style={{ color }} />;
    }
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-10">
      {/* Header Banner (GoalKicker + CodeWithHarry Notes style) */}
      <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>GoalKicker & Notes Edition</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Download Handbooks & Notes
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Comprehensive, structured developer notes and professional reference handbooks.
          Read chapter-by-chapter online or export for offline reference.
        </p>
      </div>

      {/* Grid of Handbooks (GoalKicker Book Container style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {tracks.map((track) => (
          <div
            key={track._id || track.slug}
            className="rounded-2xl border border-slate-800 bg-[#0d131f] hover:border-purple-500/40 p-6 flex flex-col items-center text-center transition-all group shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Book Cover Visual (GoalKicker style) */}
            <div
              className="w-28 h-36 rounded-xl mb-5 flex flex-col items-center justify-between p-3 border shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: `${track.color || '#38bdf8'}15`,
                borderColor: `${track.color || '#38bdf8'}40`,
              }}
            >
              <div className="w-full text-left text-[9px] uppercase tracking-widest font-mono text-slate-400">
                Almanac Series
              </div>
              <div className="my-auto">
                {getIcon(track.icon, track.color || '#38bdf8')}
              </div>
              <div className="w-full text-center text-[10px] font-bold text-white uppercase tracking-wider truncate">
                {track.name}
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
              {track.name} Handbook
            </h3>

            <p className="text-xs text-slate-400 mb-4 line-clamp-2">
              {track.description}
            </p>

            <div className="w-full mt-auto space-y-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => onSelectTrack(track.slug)}
                className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                <span>Read Online Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTrack(track.slug)}
                className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-850 text-slate-300 font-medium text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Chapterwise Notes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

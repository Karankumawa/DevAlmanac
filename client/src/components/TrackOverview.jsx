import React from 'react';
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
} from 'lucide-react';

export const TrackOverview = ({
  tracks = [],
  progressMap = {},
  onSelectTrack = () => {},
  onOpenSearch = () => {},
}) => {
  // Helper to render track icon
  const getTrackIcon = (iconName, color) => {
    switch (iconName) {
      case 'python':
        return <Code2 className="w-6 h-6" style={{ color }} />;
      case 'terminal':
        return <Terminal className="w-6 h-6" style={{ color }} />;
      case 'zap':
        return <Zap className="w-6 h-6" style={{ color }} />;
      case 'shield':
        return <Shield className="w-6 h-6" style={{ color }} />;
      default:
        return <BookOpen className="w-6 h-6" style={{ color }} />;
    }
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs text-sky-400 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Production Developer Reference</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Dev<span className="text-sky-400">Almanac</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-medium">
          "The definitive multi-language developer almanac — from syntax to systems."
        </p>

        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Structured, progressive notes across modern programming languages.
          Step-by-step line walkthroughs, memory models, runtime internals, common pitfalls, and interactive coding challenges.
        </p>

        {/* Hero Search Bar */}
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center justify-between w-full max-w-lg px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-sky-500/50 text-slate-400 hover:text-slate-200 text-sm shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-3">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              <span>Search topics, pointers, goroutines, ownership...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-xs font-mono">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>

      {/* Language Tracks Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Learning Tracks
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {tracks.length} tracks available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((track) => {
            const trackProgress = progressMap[track._id] || { completedCount: 0, percentage: 0 };
            const total = track.lessonCount || 0;

            return (
              <div
                key={track._id || track.slug}
                onClick={() => onSelectTrack(track.slug)}
                className="group relative rounded-2xl bg-[#0d131f] border border-slate-800/80 hover:border-sky-500/40 p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Glowing subtle background gradient */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 10% 20%, ${track.color || '#38bdf8'}, transparent 70%)`,
                  }}
                />

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner"
                        style={{
                          backgroundColor: `${track.color || '#38bdf8'}15`,
                          borderColor: `${track.color || '#38bdf8'}35`,
                        }}
                      >
                        {getTrackIcon(track.icon, track.color || '#38bdf8')}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                          {track.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">
                          {track.moduleCount || 0} Modules • {total} Lessons
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-sky-400 border border-slate-800 shrink-0">
                      {track.badgeText || 'Curriculum'}
                    </span>
                  </div>

                  {/* Card Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {track.description}
                  </p>

                  {/* Difficulty Pills */}
                  {track.difficulties && track.difficulties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {track.difficulties.map((diff) => (
                        <span
                          key={diff}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          {diff}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Progress & CTA */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium">Completion Progress</span>
                    <span className="font-mono text-sky-400 font-semibold">
                      {trackProgress.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${trackProgress.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {trackProgress.completedCount} of {total} completed
                    </span>
                    <span className="flex items-center space-x-1 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
                      <span>Explore Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 text-center sm:text-left">
        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
          <Code2 className="w-6 h-6 text-sky-400 mb-2 mx-auto sm:mx-0" />
          <h4 className="text-sm font-bold text-white mb-1">
            Line-by-Line Walkthroughs
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click annotated code lines to inspect memory allocations, compiler mechanics, and performance trade-offs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
          <Terminal className="w-6 h-6 text-emerald-400 mb-2 mx-auto sm:mx-0" />
          <h4 className="text-sm font-bold text-white mb-1">
            Execution Preview
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simulated CLI environment outputs demonstrate runtime behavior and concurrency timelines.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
          <Compass className="w-6 h-6 text-purple-400 mb-2 mx-auto sm:mx-0" />
          <h4 className="text-sm font-bold text-white mb-1">
            Interactive Challenges
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Validate mastery with progressive hints, starter templates, and model solutions with architectural rationales.
          </p>
        </div>
      </div>
    </div>
  );
};

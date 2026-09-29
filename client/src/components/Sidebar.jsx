import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Code,
  Clock,
  Sparkles,
  Filter,
} from 'lucide-react';

export const Sidebar = ({
  track = null,
  activeLessonSlug = '',
  completedLessonIds = [],
  onSelectLesson = () => {},
  selectedDifficulty = 'All',
  onSelectDifficulty = () => {},
  progress = null,
}) => {
  // Keep track of collapsed module IDs
  const [collapsedModules, setCollapsedModules] = useState({});

  const toggleModule = (moduleId) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (!track) {
    return (
      <aside className="w-80 shrink-0 border-r border-slate-800 bg-[#090d16] p-4 text-slate-500 text-sm">
        Select a track to view syllabus.
      </aside>
    );
  }

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter modules based on selected difficulty
  const filteredModules = (track.modules || []).filter((mod) => {
    if (selectedDifficulty === 'All') return true;
    return mod.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  const completedSet = new Set(
    (completedLessonIds || []).map((id) => (typeof id === 'object' ? id._id || id.toString() : id.toString()))
  );

  return (
    <aside className="w-80 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-slate-800/80 bg-[#0b0f19] flex flex-col select-none">
      {/* Track Header Card */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/30">
        <div className="flex items-center space-x-2.5 mb-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: track.color || '#38bdf8' }}
          />
          <h2 className="text-base font-bold text-white tracking-tight">
            {track.name}
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {track.badgeText || 'Curriculum'}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
          {track.description}
        </p>

        {/* Track Completion Progress Bar */}
        {progress && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-medium">
              <span className="text-slate-400">Track Progress</span>
              <span className="text-sky-400 font-mono font-semibold">
                {progress.completedCount || 0} / {progress.totalLessons || track.totalLessons || 0} ({progress.percentage || 0}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Difficulty Tier Filters */}
      <div className="px-3 py-2.5 border-b border-slate-800/80 bg-[#080b13]">
        <div className="flex items-center space-x-1 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <Filter className="w-3 h-3" />
          <span>Difficulty Tier</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => onSelectDifficulty(diff)}
                className={`px-1.5 py-1 text-[11px] font-medium rounded-md transition-all text-center ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Syllabus Modules Accordion */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredModules.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            No modules match the "{selectedDifficulty}" filter.
          </div>
        ) : (
          filteredModules.map((module) => {
            const isCollapsed = Boolean(collapsedModules[module._id]);
            const lessons = module.lessons || [];

            // Compute difficulty badge color
            const getDiffBadge = (diff) => {
              switch (diff) {
                case 'Beginner':
                  return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                case 'Intermediate':
                  return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                case 'Advanced':
                  return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                default:
                  return 'bg-slate-800 text-slate-400 border-slate-700';
              }
            };

            return (
              <div
                key={module._id}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden"
              >
                {/* Module Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(module._id)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center space-x-2 truncate">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {module.title}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium border ${getDiffBadge(
                      module.difficulty
                    )}`}
                  >
                    {module.difficulty}
                  </span>
                </button>

                {/* Lessons in Module */}
                {!isCollapsed && (
                  <div className="py-1 px-1.5 border-t border-slate-800/60 space-y-0.5">
                    {lessons.map((lesson) => {
                      const isActive = activeLessonSlug === lesson.slug;
                      const isCompleted = completedSet.has(lesson._id.toString());

                      return (
                        <button
                          key={lesson._id}
                          type="button"
                          onClick={() => onSelectLesson(track.slug, lesson.slug)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-all group ${
                            isActive
                              ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            {/* Completion status checkbox icon */}
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0 text-slate-500 text-[10px]">
                            {lesson.hasPractice && (
                              <Code className="w-3 h-3 text-indigo-400" title="Includes practice challenge" />
                            )}
                            <span className="font-mono">{lesson.estimatedReadTime}m</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

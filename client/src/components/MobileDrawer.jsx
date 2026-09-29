import React from 'react';
import { X, Code2, BookOpen } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const MobileDrawer = ({
  isOpen = false,
  onClose = () => {},
  tracks = [],
  activeTrack = null,
  activeLessonSlug = '',
  completedLessonIds = [],
  onSelectTrack = () => {},
  onSelectLesson = () => {},
  selectedDifficulty = 'All',
  onSelectDifficulty = () => {},
  progress = null,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-sm bg-[#090d16] border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-sky-400" />
            </div>
            <span className="font-bold text-white text-sm">
              Dev<span className="text-sky-400">Almanac</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track quick select */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 overflow-x-auto flex space-x-2">
          {tracks.map((t) => {
            const isSelected = activeTrack?.slug === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => onSelectTrack(t.slug)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-sky-500 text-white font-semibold shadow'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: t.color || '#38bdf8' }}
                />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Embedded Sidebar Syllabus */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar
            track={activeTrack}
            activeLessonSlug={activeLessonSlug}
            completedLessonIds={completedLessonIds}
            onSelectLesson={(tSlug, lSlug) => {
              onSelectLesson(tSlug, lSlug);
              onClose();
            }}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={onSelectDifficulty}
            progress={progress}
          />
        </div>
      </div>
    </div>
  );
};

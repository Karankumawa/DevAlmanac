import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileDrawer } from './components/MobileDrawer';
import { LessonReader } from './components/LessonReader';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { TrackOverview } from './components/TrackOverview';
import { api } from './services/api';

export function App() {
  const [tracks, setTracks] = useState([]);
  const [activeTrackSlug, setActiveTrackSlug] = useState('');
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeLessonSlug, setActiveLessonSlug] = useState('');
  const [currentLessonData, setCurrentLessonData] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [trackProgress, setTrackProgress] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'lesson'
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Headings for Table of Contents
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('overview');

  // 1. Initial Load: Fetch Tracks and parse URL
  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true);
        const res = await api.getTracks();
        const loadedTracks = res.data || [];
        setTracks(loadedTracks);

        // Fetch progress for all tracks to display in overview
        const pMap = {};
        for (const t of loadedTracks) {
          try {
            const pRes = await api.getProgress(t._id);
            if (pRes.success) {
              pMap[t._id] = pRes.data;
            }
          } catch (e) {
            // ignore initial progress failure
          }
        }
        setProgressMap(pMap);

        // Parse path from URL (e.g. /track/:trackSlug/:lessonSlug or hash)
        const path = window.location.pathname;
        const match = path.match(/\/track\/([^/]+)(?:\/([^/]+))?/);

        if (match && match[1]) {
          const tSlug = match[1];
          const lSlug = match[2] || '';
          loadTrackAndLesson(tSlug, lSlug, loadedTracks);
        } else if (loadedTracks.length > 0) {
          // Stay on overview by default
          setViewMode('overview');
        }
      } catch (err) {
        console.error('Failed to initialize DevAlmanac:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    // Browser back/forward navigation support
    const handlePopState = () => {
      const match = window.location.pathname.match(/\/track\/([^/]+)(?:\/([^/]+))?/);
      if (match && match[1]) {
        loadTrackAndLesson(match[1], match[2] || '');
      } else {
        setViewMode('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Global Keyboard Shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // 3. Load Track & Lesson
  const loadTrackAndLesson = async (trackSlug, lessonSlug = '', existingTracks = null) => {
    try {
      setIsLoading(true);
      const trackRes = await api.getTrack(trackSlug);
      const trackData = trackRes.data;
      setActiveTrack(trackData);
      setActiveTrackSlug(trackSlug);

      // Fetch progress for this track
      const pRes = await api.getProgress(trackData._id);
      if (pRes.success) {
        setCompletedLessonIds(pRes.data.completedLessons || []);
        setTrackProgress(pRes.data);
        setProgressMap((prev) => ({
          ...prev,
          [trackData._id]: pRes.data,
        }));
      }

      // If no lessonSlug is provided, default to the first lesson in the first module
      let targetLessonSlug = lessonSlug;
      if (!targetLessonSlug && trackData.modules?.length > 0) {
        const firstModule = trackData.modules[0];
        if (firstModule.lessons?.length > 0) {
          targetLessonSlug = firstModule.lessons[0].slug;
        }
      }

      if (targetLessonSlug) {
        await loadLesson(trackSlug, targetLessonSlug);
      } else {
        setViewMode('overview');
      }
    } catch (err) {
      console.error('Failed to load track:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Load Single Lesson
  const loadLesson = async (trackSlug, lessonSlug) => {
    try {
      const lessonRes = await api.getLesson(trackSlug, lessonSlug);
      setCurrentLessonData(lessonRes.data);
      setActiveLessonSlug(lessonSlug);
      setViewMode('lesson');

      // Update URL without reload
      const newUrl = `/track/${trackSlug}/${lessonSlug}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState(null, '', newUrl);
      }

      // Extract headings for Table of Contents
      extractHeadings(lessonRes.data.lesson.content);
    } catch (err) {
      console.error('Failed to load lesson:', err);
    }
  };

  // Helper to extract H2 & H3 from markdown content
  const extractHeadings = (markdownText) => {
    const lines = (markdownText || '').split('\n');
    const extracted = [];
    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h2Match) {
        const text = h2Match[1].replace(/[*_`]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extracted.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].replace(/[*_`]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extracted.push({ id, text, level: 3 });
      }
    }
    setHeadings(extracted);
  };

  // 5. Toggle Lesson Completion
  const handleToggleComplete = async () => {
    if (!currentLessonData?.lesson?._id) return;
    try {
      const lessonId = currentLessonData.lesson._id;
      const trackId = currentLessonData.track._id;
      const res = await api.toggleProgress(lessonId, trackId);

      if (res.success) {
        setCompletedLessonIds(res.data.completedLessons || []);
        const updatedProgress = {
          completedCount: res.data.completedCount,
          totalLessons: res.data.totalLessons,
          percentage: res.data.percentage,
        };
        setTrackProgress(updatedProgress);
        setProgressMap((prev) => ({
          ...prev,
          [trackId]: updatedProgress,
        }));
      }
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

  // Navigation handlers
  const handleSelectTrack = (trackSlug) => {
    loadTrackAndLesson(trackSlug, '');
  };

  const handleSelectLesson = (trackSlug, lessonSlug) => {
    loadLesson(trackSlug, lessonSlug);
  };

  const handleGoHome = () => {
    setViewMode('overview');
    window.history.pushState(null, '', '/');
  };

  const handleHeadingClick = (id) => {
    setActiveHeading(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine if active lesson is completed
  const isCurrentCompleted = Boolean(
    currentLessonData?.lesson?._id &&
      completedLessonIds.some((id) => (typeof id === 'object' ? id._id || id.toString() : id.toString()) === currentLessonData.lesson._id.toString())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Sticky Navigation */}
      <Navbar
        tracks={tracks}
        activeTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        onGoHome={handleGoHome}
        progress={trackProgress}
      />

      {/* Main View Container */}
      <div className="flex-1 flex w-full">
        {viewMode === 'overview' ? (
          /* Track Overview Dashboard */
          <TrackOverview
            tracks={tracks}
            progressMap={progressMap}
            onSelectTrack={handleSelectTrack}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        ) : (
          /* Responsive 3-Column Layout */
          <div className="flex w-full justify-between">
            {/* 1. Left Sidebar: Syllabus & Modules (Desktop) */}
            <div className="hidden md:block">
              <Sidebar
                track={activeTrack}
                activeLessonSlug={activeLessonSlug}
                completedLessonIds={completedLessonIds}
                onSelectLesson={handleSelectLesson}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
                progress={trackProgress}
              />
            </div>

            {/* 2. Center Canvas: Main Reader */}
            <main className="flex-1 overflow-x-hidden">
              <LessonReader
                lessonData={currentLessonData}
                isCompleted={isCurrentCompleted}
                onToggleComplete={handleToggleComplete}
                onNavigateLesson={handleSelectLesson}
                onSelectTrack={handleSelectTrack}
              />
            </main>

            {/* 3. Right Rail: Dynamic Table of Contents (Desktop > 1024px) */}
            <TableOfContents
              headings={headings}
              activeHeading={activeHeading}
              onHeadingClick={handleHeadingClick}
              isCompleted={isCurrentCompleted}
              onToggleComplete={handleToggleComplete}
              hasPitfalls={Boolean(currentLessonData?.lesson?.commonPitfalls?.length)}
              hasChallenge={Boolean(currentLessonData?.lesson?.practiceChallenge?.problem)}
            />
          </div>
        )}
      </div>

      {/* Mobile Off-Canvas Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        tracks={tracks}
        activeTrack={activeTrack}
        activeLessonSlug={activeLessonSlug}
        completedLessonIds={completedLessonIds}
        onSelectTrack={handleSelectTrack}
        onSelectLesson={handleSelectLesson}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={setSelectedDifficulty}
        progress={trackProgress}
      />

      {/* Global Search Modal (Cmd+K / Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleSelectLesson}
        tracks={tracks}
      />
    </div>
  );
}

export default App;

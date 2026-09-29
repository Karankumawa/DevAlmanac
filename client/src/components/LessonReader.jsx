import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Code2,
  Compass,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export const LessonReader = ({
  lessonData = null,
  isCompleted = false,
  onToggleComplete = () => {},
  onNavigateLesson = () => {},
  onSelectTrack = () => {},
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [revealedHints, setRevealedHints] = useState({});

  // Reset challenge state when switching lessons
  useEffect(() => {
    setShowSolution(false);
    setRevealedHints({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonData?.lesson?._id]);

  if (!lessonData || !lessonData.lesson) {
    return (
      <div className="flex-1 p-8 text-center text-slate-500">
        Loading lesson content...
      </div>
    );
  }

  const { lesson, track, module, breadcrumbs, navigation } = lessonData;

  const handleCompleteClick = () => {
    if (!isCompleted) {
      // Fire confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6'],
      });
    }
    onToggleComplete();
  };

  const toggleHint = (index) => {
    setRevealedHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Get difficulty badge styling
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const challenge = lesson.practiceChallenge;
  const snippets = lesson.codeSnippets || [];
  const pitfalls = lesson.commonPitfalls || [];

  return (
    <article className="flex-1 min-w-0 max-w-4xl mx-auto px-4 sm:px-8 py-8">
      {/* 1. Breadcrumbs Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onSelectTrack(track?.slug)}
          className="hover:text-sky-400 transition-colors shrink-0"
        >
          Tracks
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button
          type="button"
          onClick={() => onSelectTrack(track?.slug)}
          className="hover:text-sky-400 transition-colors font-medium text-slate-300 shrink-0"
        >
          {track?.name}
        </button>
        {module && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-slate-400 shrink-0">{module.title}</span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-sky-400 font-medium truncate">{lesson.title}</span>
      </nav>

      {/* 2. Lesson Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {module?.difficulty && (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getDifficultyBadge(
                module.difficulty
              )}`}
            >
              {module.difficulty}
            </span>
          )}
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{lesson.estimatedReadTime} min read</span>
          </span>
          {isCompleted && (
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Completed</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
          {lesson.title}
        </h1>

        {/* 3. Concept Overview Card */}
        <div
          id="overview"
          className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/30 via-slate-900/60 to-slate-900/40 border border-sky-500/20 shadow-xl"
        >
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            <Compass className="w-4 h-4" />
            <span>Core Concept Overview</span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            {lesson.overview}
          </p>
        </div>
      </header>

      {/* 4. Main Markdown Content */}
      <section className="markdown-body prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ node, ...props }) => {
              const text = props.children?.toString() || '';
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <h2
                  id={id}
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-8 mb-4 pb-2 border-b border-slate-800 flex items-center space-x-2"
                  {...props}
                />
              );
            },
            h3: ({ node, ...props }) => {
              const text = props.children?.toString() || '';
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <h3
                  id={id}
                  className="text-lg sm:text-xl font-bold text-slate-200 mt-6 mb-3"
                  {...props}
                />
              );
            },
            p: ({ node, ...props }) => <p className="my-3 text-slate-300 leading-relaxed" {...props} />,
            ul: ({ node, ...props }) => <ul className="my-3 list-disc pl-6 space-y-1 text-slate-300" {...props} />,
            ol: ({ node, ...props }) => <ol className="my-3 list-decimal pl-6 space-y-1 text-slate-300" {...props} />,
            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="my-4 border-l-4 border-sky-500/80 bg-slate-900/60 p-4 rounded-r-xl text-slate-300 italic"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="my-6 overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th className="bg-slate-900 px-4 py-3 font-semibold text-white border-b border-slate-800" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-2.5 border-b border-slate-800/60" {...props} />
            ),
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');

              if (!inline && match) {
                return (
                  <CodeBlock
                    code={codeString}
                    language={match[1]}
                    fileName={`example.${match[1]}`}
                  />
                );
              }

              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-slate-800/80 text-sky-300 font-mono text-xs border border-slate-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </section>

      {/* 5. Code Walkthroughs */}
      {snippets.length > 0 && (
        <section id="code-walkthrough" className="my-10 pt-6 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>Step-by-Step Code Walkthrough</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Interactive code breakdown with line annotations and execution preview. Click highlighted lines for architectural notes.
          </p>

          <div className="space-y-6">
            {snippets.map((snip, index) => (
              <CodeBlock
                key={snip._id || index}
                code={snip.code}
                language={snip.language}
                fileName={snip.fileName}
                explanation={snip.explanation}
                annotations={snip.annotations}
                simulatedOutput={snip.simulatedOutput}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Common Pitfalls & Anti-Patterns */}
      {pitfalls.length > 0 && (
        <section
          id="common-pitfalls"
          className="my-10 p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-xl"
        >
          <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Common Pitfalls & Anti-Patterns</span>
          </div>

          <ul className="space-y-3">
            {pitfalls.map((pitfall, index) => (
              <li key={index} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                <span className="leading-relaxed">{pitfall}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 7. Practice Challenge */}
      {challenge && challenge.problem && (
        <section
          id="practice-challenge"
          className="my-10 p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 shadow-xl"
        >
          <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-indigo-400 mb-3">
            <Trophy className="w-4 h-4 text-indigo-400" />
            <span>Interactive Practice Challenge</span>
          </div>

          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans mb-4">
            {challenge.problem}
          </div>

          {/* Starter Code */}
          {challenge.starterCode && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-400 mb-1.5 font-mono">
                Starter Code:
              </div>
              <CodeBlock
                code={challenge.starterCode}
                language={snippets[0]?.language || 'python'}
                fileName="challenge_starter"
              />
            </div>
          )}

          {/* Progressive Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="my-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Hints ({challenge.hints.length})</span>
              </div>
              {challenge.hints.map((hint, index) => (
                <div key={index} className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleHint(index)}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>Hint {index + 1}</span>
                    <span className="text-[11px] text-sky-400 font-mono">
                      {revealedHints[index] ? 'Hide' : 'Reveal'}
                    </span>
                  </button>
                  {revealedHints[index] && (
                    <div className="px-3 py-2.5 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Solution Reveal Button */}
          {challenge.solution && (
            <div className="mt-4 pt-4 border-t border-indigo-500/20">
              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
              >
                {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSolution ? 'Hide Solution' : 'Reveal Solution'}</span>
              </button>

              {showSolution && (
                <div className="mt-4 space-y-3 animate-in fade-in duration-200">
                  <div className="text-xs font-semibold text-emerald-400 font-mono">
                    Model Solution:
                  </div>
                  <CodeBlock
                    code={challenge.solution}
                    language={snippets[0]?.language || 'python'}
                    fileName="solution"
                    explanation={challenge.solutionExplanation}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 8. Navigation & Progress Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-800/80 space-y-6">
        {/* Mark as Completed CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0d131f] border border-slate-800 gap-4">
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              {isCompleted ? 'Lesson Completed!' : 'Finished reading this lesson?'}
            </h4>
            <p className="text-xs text-slate-400">
              Track your progress across the {track?.name} curriculum.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompleteClick}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center space-x-2 active:scale-95 ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                : 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-sky-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
          </button>
        </div>

        {/* Previous & Next Lesson Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navigation?.prev ? (
            <button
              type="button"
              onClick={() => onNavigateLesson(track.slug, navigation.prev.slug)}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-850 hover:border-sky-500/30 text-left transition-all group"
            >
              <div className="flex items-center space-x-1.5 text-[11px] font-medium text-slate-400 mb-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Lesson</span>
              </div>
              <div className="text-sm font-bold text-slate-200 group-hover:text-sky-400 transition-colors truncate">
                {navigation.prev.title}
              </div>
            </button>
          ) : (
            <div />
          )}

          {navigation?.next && (
            <button
              type="button"
              onClick={() => onNavigateLesson(track.slug, navigation.next.slug)}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-850 hover:border-sky-500/30 text-right transition-all group sm:col-start-2"
            >
              <div className="flex items-center justify-end space-x-1.5 text-[11px] font-medium text-slate-400 mb-1">
                <span>Next Lesson</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-bold text-slate-200 group-hover:text-sky-400 transition-colors truncate">
                {navigation.next.title}
              </div>
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};

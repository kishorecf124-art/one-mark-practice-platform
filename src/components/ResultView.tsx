import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Flame,
  RotateCcw,
  BookOpen,
  Home,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';

interface ResultViewProps {
  sessionId: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ sessionId }) => {
  const {
    navigateHome,
    navigateSubjectDetail,
    navigateSubjects,
    navigateWrongQuestions,
    startWrongQuestionsPractice,
    goBack,
  } = useApp();

  const session = storage.getSession(sessionId);

  useEffect(() => {
    if (session && session.accuracy >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if not supported
      }
    }
  }, [session]);

  if (!session) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <p className="text-slate-500">Session data not found.</p>
        <button
          onClick={navigateHome}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const total = session.total;
  const correct = session.score;
  const wrong = total - correct;
  const accuracy = session.accuracy;

  // Compute duration
  let durationStr = 'N/A';
  if (session.startTime && session.endTime) {
    const seconds = Math.floor((session.endTime - session.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  const subject = storage.getSubject(session.subjectId);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold shadow-2xs hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer group"
          title="Back to previous screen"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Celebration Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-850 text-amber-500 shadow-md">
          <Trophy className="w-12 h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          🎉 Practice Completed
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {session.title}
        </p>
      </div>

      {/* Large Score Display: e.g. "42 / 55 Correct" */}
      <div
        id="result_score_banner"
        className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800/90 shadow-sm text-center space-y-2"
      >
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Final Score
        </div>
        <div className="text-5xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
          {correct} <span className="text-2xl sm:text-3xl text-slate-400 font-normal">/ {total}</span>
        </div>
        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {accuracy >= 80 ? 'Outstanding performance!' : accuracy >= 50 ? 'Good effort! Review wrong ones to master.' : 'Keep practicing, improvement comes with repetition.'}
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-center">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Questions</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-center">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Correct</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{correct}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-center">
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Wrong</span>
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{wrong}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-center">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{accuracy}%</div>
        </div>
      </div>

      {durationStr !== 'N/A' && (
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Total practice time: {durationStr}</span>
        </div>
      )}

      {/* Primary Action Buttons as specified in Requirement 13 */}
      <div className="pt-4 space-y-3" id="result_action_buttons">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Review Wrong Questions */}
          <button
            id="result_review_wrong_btn"
            onClick={() => navigateWrongQuestions(session.subjectId, session.unitId)}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Review Wrong Questions ({wrong})</span>
          </button>

          {/* Practice Wrong Questions Again */}
          <button
            id="result_practice_wrong_again_btn"
            disabled={wrong === 0}
            onClick={() => startWrongQuestionsPractice(session.subjectId, session.unitId)}
            className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm shadow-xs transition-all cursor-pointer ${
              wrong > 0
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Practice Wrong Questions Again</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Back to Subject */}
          <button
            id="result_back_to_subject_btn"
            onClick={() => {
              if (subject) {
                navigateSubjectDetail(subject.id);
              } else {
                navigateSubjects();
              }
            }}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Back to {subject?.name || 'Subjects'}</span>
          </button>

          {/* Back to Home */}
          <button
            id="result_back_to_home_btn"
            onClick={navigateHome}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

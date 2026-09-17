import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Percent,
  BookOpen,
  Award,
  Calendar,
  Layers,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import * as storage from '../utils/storage';
import { useApp } from '../context/AppContext';

export const ProgressView: React.FC = () => {
  const { navigateSubjectDetail, goBack } = useApp();
  const stats = storage.getProgressStats();
  const sessions = storage.getSessions();
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>(
    stats.subjectStats[0]?.subject.id || ''
  );

  const activeSubjectStat = stats.subjectStats.find(
    (s) => s.subject.id === selectedSubjectTab
  ) || stats.subjectStats[0];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Back to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Progress & Analytics
            </h1>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Detailed breakdown of your one-mark mastery across subjects and units.
        </p>
      </div>

      {/* Overall Performance Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Overall Performance
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Total Questions</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.totalQuestions}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">In question bank</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Attempted</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.questionsAttempted}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats.totalQuestions > 0
                ? `${Math.round((stats.questionsAttempted / stats.totalQuestions) * 100)}% coverage`
                : '0%'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Correct Answers</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.correctAttemptsCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across all tries</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">Wrong Answers</div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {stats.wrongAttemptsCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats.activeWrongCount} to master
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs col-span-2 sm:col-span-1">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Accuracy</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {stats.overallAccuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Overall precision</div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Progress Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Subject-wise Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.subjectStats.map(({ subject, accuracy, totalQuestions, attemptedCount }) => {
            const coverage = totalQuestions > 0 ? Math.round((attemptedCount / totalQuestions) * 100) : 0;
            return (
              <div
                key={subject.id}
                onClick={() => setSelectedSubjectTab(subject.id)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                  selectedSubjectTab === subject.id
                    ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {subject.name}
                  </h3>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {accuracy > 0 ? `${accuracy}%` : '0%'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Accuracy Rate</span>
                    <span className="font-semibold">{accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 pt-2">
                    <span>Coverage</span>
                    <span className="font-semibold">{attemptedCount} / {totalQuestions} ({coverage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${coverage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit-Wise Progress Breakdown */}
      {activeSubjectStat && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Unit-wise Progress — {activeSubjectStat.subject.name}
              </h2>
              <p className="text-xs text-slate-500">
                Detailed accuracy and question counts for each unit
              </p>
            </div>
            <button
              onClick={() => navigateSubjectDetail(activeSubjectStat.subject.id)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
            >
              Practice {activeSubjectStat.subject.name} →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-4 shadow-xs">
            {activeSubjectStat.unitStats.map(({ unit, totalQuestions, accuracy, attemptedCount }) => {
              return (
                <div
                  key={unit.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {unit.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {attemptedCount} of {totalQuestions} questions attempted
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:w-64">
                    <div className="flex-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            accuracy >= 80
                              ? 'bg-emerald-500'
                              : accuracy >= 50
                              ? 'bg-amber-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 w-12 text-right">
                      {accuracy > 0 ? `${accuracy}%` : '0%'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Sessions History */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Recent Practice Sessions
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
            {sessions.slice(0, 5).map((sess) => (
              <div
                key={sess.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {sess.title}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(sess.date).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {sess.score} / {sess.total}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">({sess.accuracy}%)</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      sess.isCompleted
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {sess.isCompleted ? 'Completed' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

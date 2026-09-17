import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  ArrowRight,
  XCircle,
  User,
  GraduationCap,
  School,
  Target,
  Award,
  TrendingUp,
  BarChart3,
  Sparkles,
  RotateCcw,
  FileText,
  Trash2,
  X,
  Plus,
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';

export const HomeView: React.FC = () => {
  const {
    userProfile,
    activeWrongCount,
    activeSession,
    continueActiveSession,
    navigateSubjects,
    navigateSubjectDetail,
    navigateWrongQuestions,
    navigateImportPdf,
    navigateProgress,
    refreshData,
    showToast,
  } = useApp();

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const stats = storage.getProgressStats();
  const subjects = storage.getSubjects();
  const allQuestions = storage.getQuestions();
  const allUnits = storage.getUnits();

  const studentName = userProfile.name?.trim() || 'Kishore';
  const studentInitial = studentName.charAt(0).toUpperCase();
  const progressPercent =
    stats.totalQuestions > 0
      ? Math.min(100, Math.round((stats.questionsAttempted / stats.totalQuestions) * 100))
      : 0;

  const handleDeleteSubjectQuestions = (subjectId: string, subjectName: string) => {
    const isInitial = storage.INITIAL_SUBJECTS.some((s) => s.id === subjectId);
    if (isInitial) {
      storage.clearSubjectQuestions(subjectId, true);
      showToast(`Reset questions for ${subjectName}`, 'info');
    } else {
      storage.deleteSubject(subjectId);
      showToast(`Deleted custom subject ${subjectName}`, 'info');
    }
    setConfirmDeleteId(null);
    refreshData();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header / Welcome Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <span>Welcome, {studentName}</span>
            <span className="inline-block text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Your personalized dashboard for offline one-mark exam practice and mastery.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          {/* Uploaded PDFs Management Button */}
          <button
            id="home_uploaded_pdfs_btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            title="View and manage uploaded PDFs"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Uploaded PDFs</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-extrabold ml-0.5">
              {subjects.length}
            </span>
          </button>

          {activeSession && (
            <button
              id="home_resume_practice_btn"
              onClick={continueActiveSession}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              title="Resume unfinished test"
            >
              <RotateCcw className="w-4 h-4 animate-spin-slow" />
              <span>Resume Session</span>
            </button>
          )}

          <button
            id="home_start_practice_btn"
            onClick={navigateSubjects}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice</span>
          </button>
        </div>
      </div>

      {/* Main 2-Card Layout: Your Details (Left) + Your Practice (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Your Details */}
        <div
          id="home_your_details_card"
          className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col space-y-5"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Details
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Student Profile
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
              Active Student
            </span>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {/* Name Row */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4 text-indigo-500" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Name
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {studentName}
              </span>
            </div>

            {/* Class / Grade Row */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Class / Grade
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {userProfile.grade?.trim() || '—'}
              </span>
            </div>

            {/* School / Institution Row */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <School className="w-4 h-4 text-amber-500" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  School / Institution
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {userProfile.school?.trim() || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Your Practice */}
        <div
          id="home_your_practice_card"
          className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col space-y-5"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Practice
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Curriculum & Progress Stats
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60">
              Ready to Practice
            </span>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {/* Subjects Row */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Subjects
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {subjects.length}
              </span>
            </div>

            {/* Total Questions Row */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Total Questions
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {stats.totalQuestions}
              </span>
            </div>

            {/* Questions Practiced Row */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Questions Practiced
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {stats.questionsAttempted > 0 ? stats.questionsAttempted : '—'}
              </span>
            </div>

            {/* Overall Accuracy Row */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Overall Accuracy
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {stats.overallAccuracy > 0 ? `${stats.overallAccuracy}%` : '—'}
              </span>
            </div>
          </div>

          {/* Question Bank Coverage Bar inside Card 2 */}
          <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Question Bank Coverage
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded PDFs & Question Bank Management Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div
            id="uploaded_pdfs_management_modal"
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Uploaded PDFs & Question Bank
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    View active subjects, question counts, or remove uploaded PDF data
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsPdfModalOpen(false);
                  setConfirmDeleteId(null);
                }}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action to Upload New PDF */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
              <div>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                  Want to import more Questions or Unit PDFs?
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Upload 2 PDFs (Questions + Answer Key) or a single combined file
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPdfModalOpen(false);
                  navigateImportPdf();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-all hover:scale-102 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New PDF</span>
              </button>
            </div>

            {/* Uploaded Subjects / PDFs List */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {subjects.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No Subjects or Uploaded PDFs Found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload your first PDF question paper to get started.
                  </p>
                </div>
              ) : (
                subjects.map((subj) => {
                  const subQuestions = allQuestions.filter((q) => q.subjectId === subj.id);
                  const subUnits = allUnits.filter((u) => u.subjectId === subj.id);
                  const isInitial = storage.INITIAL_SUBJECTS.some((s) => s.id === subj.id);
                  const isConfirming = confirmDeleteId === subj.id;

                  return (
                    <div
                      key={subj.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Subject Info */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs font-bold text-xs">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {subj.name}
                              </h4>
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                  isInitial
                                    ? 'bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                }`}
                              >
                                {isInitial ? 'Core Subject' : 'Imported PDF'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span>
                                <strong>{subQuestions.length}</strong> Questions
                              </span>
                              <span>•</span>
                              <span>
                                <strong>{subUnits.length}</strong> Units
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPdfModalOpen(false);
                              navigateSubjectDetail(subj.id);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Practice
                          </button>

                          {/* Delete / Reset Button */}
                          {isConfirming ? (
                            <div className="flex items-center gap-1.5 animate-fadeIn">
                              <button
                                type="button"
                                onClick={() => handleDeleteSubjectQuestions(subj.id, subj.name)}
                                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(subj.id)}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60"
                              title={isInitial ? 'Reset questions for this subject' : 'Delete uploaded PDF subject'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Confirmation warning text */}
                      {isConfirming && (
                        <div className="mt-3 pt-2.5 border-t border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-[11px] text-rose-600 dark:text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            {isInitial
                              ? `This will remove all ${subQuestions.length} questions from ${subj.name} and clear attempts.`
                              : `This will permanently delete ${subj.name} and all its uploaded PDF questions.`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div className="text-xs text-slate-400">
                Total {stats.totalQuestions} questions stored locally offline
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPdfModalOpen(false);
                  setConfirmDeleteId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


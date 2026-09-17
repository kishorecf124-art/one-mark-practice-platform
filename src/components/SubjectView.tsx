import React, { useState } from 'react';
import {
  BookOpen,
  Shuffle,
  Layers,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Play,
  FileUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';
import { SubjectPdfUploadModal } from './SubjectPdfUploadModal';

interface SubjectViewProps {
  subjectId: string;
}

export const SubjectView: React.FC<SubjectViewProps> = ({ subjectId }) => {
  const {
    navigateSubjects,
    navigateUnitList,
    startSubjectRandomPractice,
    navigateImportPdf,
    refreshData,
    goBack,
  } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const subject = storage.getSubject(subjectId);
  const units = storage.getUnits(subjectId);
  const questions = storage.getQuestions({ subjectId });
  const stats = storage.getProgressStats();
  const subjectStat = stats.subjectStats.find((s) => s.subject.id === subjectId);

  if (!subject) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Subject not found.</p>
        <button
          onClick={navigateSubjects}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const unitsCount = units.length;
  const overallAccuracy = subjectStat ? subjectStat.accuracy : 0;
  const questionsAttempted = subjectStat ? subjectStat.attemptedCount : 0;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Back to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Subject Practice Hub
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {totalQuestions} Questions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {subject.name}
            </h1>
          </div>
        </div>

        <button
          id="btn_subject_upload_pdf"
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs transition-all cursor-pointer hover:scale-[1.02] flex-shrink-0"
        >
          <FileUp className="w-4 h-4" />
          <span>Upload / Replace PDF</span>
        </button>
      </div>

      {/* Subject Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Questions</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalQuestions}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Number of Units</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {unitsCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Accuracy</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {overallAccuracy > 0 ? `${overallAccuracy}%` : '0%'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Questions Attempted</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {questionsAttempted} <span className="text-xs font-normal text-slate-400">/ {totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Exactly TWO Main Practice Options */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Select Practice Method
        </h2>

        {totalQuestions === 0 ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileUp className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              No Questions in {subject.name} Yet
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Import a one-mark question paper PDF to extract questions and units for {subject.name}.
            </p>
            <div className="pt-2">
              <button
                id="btn_import_empty_subject"
                onClick={navigateImportPdf}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <FileUp className="w-4 h-4" />
                <span>Import PDF for {subject.name}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OPTION 1 — UNIT WISE */}
            <div
              id="subject_option_unit_wise"
              onClick={() => navigateUnitList(subject.id)}
              className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
                  Option 1
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  UNIT WISE
                </h3>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Select from {unitsCount} individual units</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  id="btn_select_unit_wise"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <span>Select Unit</span>
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* OPTION 2 — RANDOM */}
            <div
              id="subject_option_random"
              onClick={() => startSubjectRandomPractice(subject.id)}
              className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800/80 hover:border-violet-500 dark:hover:border-violet-500 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/70 border border-violet-100 dark:border-violet-900 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <Shuffle className="w-7 h-7" />
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-50 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60 mb-2">
                  Option 2
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  RANDOM
                </h3>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                  <span>All {totalQuestions} questions shuffled</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  id="btn_start_subject_random"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-sm shadow-md shadow-violet-600/25 transition-all cursor-pointer"
                >
                  <span>Start All-Unit Random</span>
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload PDF Modal */}
      <SubjectPdfUploadModal
        subjectId={subject.id}
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          refreshData();
        }}
      />
    </div>
  );
};


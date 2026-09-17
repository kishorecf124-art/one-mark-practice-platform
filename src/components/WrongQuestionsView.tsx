import React, { useState } from 'react';
import {
  XCircle,
  Flame,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  History,
  Info,
  BookOpen,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';
import { AnswerOption, WrongQuestionRecord } from '../types';
import { ChemicalContent } from './ChemicalRenderer';

interface WrongQuestionsViewProps {
  filterSubjectId?: string;
  filterUnitId?: string;
}

export const WrongQuestionsView: React.FC<WrongQuestionsViewProps> = ({
  filterSubjectId: initialSubj,
  filterUnitId: initialUnit,
}) => {
  const { subjects, startWrongQuestionsPractice, goBack } = useApp();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubj || 'all');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnit || 'all');
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');

  // Fetch wrong questions
  const filterParams: { subjectId?: string; unitId?: string } = {};
  if (selectedSubjectId !== 'all') filterParams.subjectId = selectedSubjectId;
  if (selectedUnitId !== 'all') filterParams.unitId = selectedUnitId;

  const rawList = storage.getWrongQuestions(filterParams);
  const filteredList = activeTab === 'active' ? rawList.filter((w) => !w.mastered) : rawList;

  // Units for currently selected subject
  const availableUnits =
    selectedSubjectId !== 'all' ? storage.getUnits(selectedSubjectId) : [];

  const handleSubjectChange = (subjId: string) => {
    setSelectedSubjectId(subjId);
    setSelectedUnitId('all');
  };

  const getOptionText = (item: WrongQuestionRecord, key: AnswerOption) => {
    switch (key) {
      case 'A': return item.optionA;
      case 'B': return item.optionB;
      case 'C': return item.optionC;
      case 'D': return item.optionD;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fadeIn select-none">
      {/* Header and Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="p-2 mt-0.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Back to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-600">
                <XCircle className="w-5 h-5" />
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Wrong Questions
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review questions you missed during practice. Practicing them again turns weaknesses into 100% mastery.
            </p>
          </div>
        </div>

        {/* Practice Wrong Questions Button */}
        <button
          id="practice_wrong_questions_main_btn"
          disabled={filteredList.length === 0}
          onClick={() =>
            startWrongQuestionsPractice(
              selectedSubjectId !== 'all' ? selectedSubjectId : undefined,
              selectedUnitId !== 'all' ? selectedUnitId : undefined
            )
          }
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
            filteredList.length > 0
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25 hover:scale-[1.02]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>🔥 Practice Wrong Questions ({filteredList.length})</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5" id="wrong_subject_filters">
          <button
            onClick={() => handleSubjectChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedSubjectId === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subj) => (
            <button
              key={subj.id}
              onClick={() => handleSubjectChange(subj.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedSubjectId === subj.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {subj.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Dropdown Filter */}
          {selectedSubjectId !== 'all' && availableUnits.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unit:</span>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Units</option>
                {availableUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Tab (To Review vs All History) */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'active'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Needs Practice
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Full History ({rawList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Questions Cards List */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No wrong questions recorded!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {activeTab === 'active' && rawList.length > 0
              ? 'Great job! You have practiced and mastered all previously missed questions.'
              : 'As you practice one-mark questions, any question you answer incorrectly will automatically appear here for review.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4" id="wrong_questions_list">
          {filteredList.map((item, idx) => {
            const subj = storage.getSubject(item.subjectId);
            const unit = storage.getUnit(item.unitId);

            return (
              <div
                key={item.questionId + '_' + idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4"
              >
                {/* Header tags */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                      {subj?.name || 'Subject'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {unit?.name || 'Unit'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
                      Missed {item.wrongCount} {item.wrongCount === 1 ? 'time' : 'times'}
                    </span>
                    {item.mastered && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Mastered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  <ChemicalContent content={item.question} />
                </div>

                {/* Question Diagram / Image if present */}
                {item.imageUrl && (
                  <div className="my-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                    <img
                      src={item.imageUrl}
                      alt="Question Diagram"
                      className="max-h-56 w-auto max-w-full rounded-xl object-contain mx-auto border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2"
                    />
                  </div>
                )}

                {/* Answer comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 text-rose-900 dark:text-rose-200">
                    <span className="font-bold block text-rose-700 dark:text-rose-400 text-xs mb-1">
                      Your Previous Answer:
                    </span>
                    <div className="flex items-start gap-1">
                      <span className="font-semibold">{item.lastSelectedAnswer}.</span>{' '}
                      <ChemicalContent content={getOptionText(item, item.lastSelectedAnswer)} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200">
                    <span className="font-bold block text-emerald-700 dark:text-emerald-400 text-xs mb-1">
                      Correct Answer:
                    </span>
                    <div className="flex items-start gap-1">
                      <span className="font-semibold">{item.correctAnswer}.</span>{' '}
                      <ChemicalContent content={getOptionText(item, item.correctAnswer)} />
                    </div>
                  </div>
                </div>

                {/* Date stamp & options list snippet */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>Last attempted: {new Date(item.lastAttemptDate).toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono">OneQuest Bank</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

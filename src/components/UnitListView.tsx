import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ListOrdered,
  Shuffle,
  X,
  Play,
  Layers,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Unit } from '../types';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';

interface UnitListViewProps {
  subjectId: string;
}

export const UnitListView: React.FC<UnitListViewProps> = ({ subjectId }) => {
  const {
    navigateSubjectDetail,
    startUnitPractice,
    navigateImportPdf,
    refreshData,
    showToast,
    goBack,
  } = useApp();
  const subject = storage.getSubject(subjectId);
  const units = storage.getUnits(subjectId);
  const questions = storage.getQuestions({ subjectId });

  // Selected unit for mode selection popup
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  if (!subject) {
    return null;
  }

  const getQuestionCount = (unitId: string) => {
    return storage.getQuestions({ subjectId, unitId }).length;
  };

  const handleDeleteSingleUnit = (unit: Unit) => {
    const res = storage.deleteUnitAndQuestions(unit.id);
    refreshData();
    setUnitToDelete(null);
    showToast(`Removed unit "${unit.name}" and ${res.questionsRemoved} questions!`, 'success');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn relative">
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
                {subject.name}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unit Wise Selection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Select a Unit
            </h1>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Choose any unit to practice all of its one-mark questions either in sequential order or randomized.
      </p>

      {/* Units List */}
      <div className="space-y-3">
        {units.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">No units found in {subject.name}.</p>
            <button
              onClick={navigateImportPdf}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              Upload PDF to create units
            </button>
          </div>
        ) : (
          units.map((unit) => {
            const count = getQuestionCount(unit.id);
            return (
              <div
                key={unit.id}
                id={`unit_row_${unit.id}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-150 flex items-center justify-between"
              >
                <div
                  onClick={() => setSelectedUnit(unit)}
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-base group-hover:scale-105 transition-transform">
                    {unit.unitNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {unit.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {count} Questions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUnitToDelete(unit)}
                    className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title={`Delete Unit ${unit.unitNumber} & its questions`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div
                    onClick={() => setSelectedUnit(unit)}
                    className="flex items-center gap-2 cursor-pointer pl-1"
                  >
                    <span className="hidden sm:inline-flex text-xs font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                      Choose Mode
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Single Unit Confirmation Dialog */}
      {unitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-900/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Unit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{unitToDelete.name}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this unit and all of its {getQuestionCount(unitToDelete.id)} questions?
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUnitToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSingleUnit(unitToDelete)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Delete Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIT PRACTICE MODE SELECTION MODAL */}
      {selectedUnit && (
        <div
          id="unit_practice_mode_modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {subject.name}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedUnit.name}
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Total Questions: <span className="font-bold text-slate-900 dark:text-white">{getQuestionCount(selectedUnit.id)} questions</span> (All questions will be practiced)
                </p>
              </div>
              <button
                onClick={() => setSelectedUnit(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exactly TWO Options: ORDER or RANDOM */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Choose Unit Practice Mode
              </div>

              {/* 📋 ORDER OPTION */}
              <div
                id="unit_mode_order_btn"
                onClick={() => {
                  const u = selectedUnit;
                  setSelectedUnit(null);
                  startUnitPractice(subject.id, u.id, 'order');
                }}
                className="group p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <ListOrdered className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        ORDER
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        Q1 → Q{getQuestionCount(selectedUnit.id)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Practice all questions in their original order.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 dark:text-slate-300 transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* 🎲 RANDOM OPTION */}
              <div
                id="unit_mode_random_btn"
                onClick={() => {
                  const u = selectedUnit;
                  setSelectedUnit(null);
                  startUnitPractice(subject.id, u.id, 'random');
                }}
                className="group p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 hover:bg-violet-50/40 dark:hover:bg-violet-950/20 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
                    <Shuffle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        RANDOM
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                        Shuffled
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Practice all questions from this unit in a random order.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-600 group-hover:text-white text-slate-600 dark:text-slate-300 transition-colors">
                  <Shuffle className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-[11px] text-center text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              Rule: All {getQuestionCount(selectedUnit.id)} questions will be practiced without repetition.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


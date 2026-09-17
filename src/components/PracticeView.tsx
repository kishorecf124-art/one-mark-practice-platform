import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Info,
  LogOut,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { AnswerOption, Question, PracticeSession } from '../types';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';
import { ChemicalContent } from './ChemicalRenderer';

interface PracticeViewProps {
  sessionId: string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ sessionId }) => {
  const { setViewState, navigateHome, refreshData, goBack } = useApp();
  const [session, setSession] = useState<PracticeSession | null>(() => {
    return storage.getSession(sessionId) || storage.getActiveSession();
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  // Load question when session or currentIndex changes
  useEffect(() => {
    if (!session) return;
    const qId = session.questionIds[session.currentIndex];
    const q = storage.getQuestion(qId);
    setCurrentQuestion(q || null);

    // Check if current question was already answered in this session (e.g. resuming)
    if (session.answers[qId]) {
      const answered = session.answers[qId];
      setSelectedOption(answered.selected);
      setHasAnswered(true);
      setIsCurrentCorrect(answered.isCorrect);
    } else {
      setSelectedOption(null);
      setHasAnswered(false);
    }
  }, [session?.currentIndex, session?.id]);

  // Handle answering an option
  const handleSelectOption = (option: AnswerOption) => {
    if (hasAnswered || !currentQuestion || !session) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    const now = new Date().toISOString();

    setSelectedOption(option);
    setHasAnswered(true);
    setIsCurrentCorrect(isCorrect);

    // Save attempt record
    storage.recordAttempt({
      sessionId: session.id,
      questionId: currentQuestion.id,
      subjectId: currentQuestion.subjectId,
      unitId: currentQuestion.unitId,
      selectedAnswer: option,
      isCorrect,
      date: now,
    });

    // Rule 10: Automatic Wrong Question System
    if (!isCorrect) {
      storage.recordWrongQuestion(currentQuestion, option);
    } else if (session.mode === 'wrong_review') {
      // Record correct improvement in wrong questions review mode
      storage.recordCorrectWrongQuestionReview(currentQuestion.id, option);
    }

    // Update session state
    const newAnswers = {
      ...session.answers,
      [currentQuestion.id]: {
        selected: option,
        isCorrect,
        timestamp: now,
      },
    };

    const newScore = Object.values(newAnswers).filter((a: any) => a?.isCorrect).length;
    const updatedSession: PracticeSession = {
      ...session,
      answers: newAnswers,
      score: newScore,
      accuracy: Math.round((newScore / (session.currentIndex + 1)) * 100),
    };

    storage.saveSession(updatedSession);
    setSession(updatedSession);
    refreshData();
  };

  // Move to next question or finish session
  const handleNext = () => {
    if (!session) return;

    if (session.currentIndex + 1 >= session.total) {
      // Session Completed!
      const finalScore = Object.values(session.answers).filter((a: any) => a?.isCorrect).length;
      const completedSession: PracticeSession = {
        ...session,
        isCompleted: true,
        endTime: Date.now(),
        score: finalScore,
        accuracy: Math.round((finalScore / session.total) * 100),
      };
      storage.saveSession(completedSession);
      storage.clearActiveSession();
      refreshData();
      setViewState({ type: 'result', sessionId: session.id });
    } else {
      // Advance to next question
      const updatedSession: PracticeSession = {
        ...session,
        currentIndex: session.currentIndex + 1,
      };
      storage.saveSession(updatedSession);
      setSession(updatedSession);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitModal) return;

      if (!hasAnswered) {
        if (e.key === 'a' || e.key === 'A' || e.key === '1') handleSelectOption('A');
        if (e.key === 'b' || e.key === 'B' || e.key === '2') handleSelectOption('B');
        if (e.key === 'c' || e.key === 'C' || e.key === '3') handleSelectOption('C');
        if (e.key === 'd' || e.key === 'D' || e.key === '4') handleSelectOption('D');
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!session || !currentQuestion) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <p className="text-slate-600 dark:text-slate-400">Loading practice question...</p>
        <button
          onClick={navigateHome}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const subject = storage.getSubject(currentQuestion.subjectId);
  const unit = storage.getUnit(currentQuestion.unitId);
  const currentIndex = session.currentIndex;
  const total = session.total;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const options: Array<{ key: AnswerOption; text: string }> = [
    { key: 'A', text: currentQuestion.optionA },
    { key: 'B', text: currentQuestion.optionB },
    { key: 'C', text: currentQuestion.optionC },
    { key: 'D', text: currentQuestion.optionD },
  ];

  const getOptionLetterText = (key: AnswerOption) => {
    switch (key) {
      case 'A': return currentQuestion.optionA;
      case 'B': return currentQuestion.optionB;
      case 'C': return currentQuestion.optionC;
      case 'D': return currentQuestion.optionD;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fadeIn select-none">
      {/* Top Bar: Breadcrumb info, Progress, and Exit */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitModal(true)}
            id="practice_exit_btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer group"
            title="Go back to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-slate-700 dark:text-slate-200" />
            <span>Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {subject?.name || 'Practice'}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {unit?.name || (session.mode === 'wrong_review' ? 'Wrong Questions Practice' : 'All Units')}
              </span>
            </div>
          </div>
        </div>

        {/* Question Counter: "Question 4 of 55" */}
        <div className="text-right">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            Question <span className="text-indigo-600 dark:text-indigo-400 font-black">{currentIndex + 1}</span> of {total}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            {progressPercent}% completed
          </div>
        </div>
      </div>

      {/* Animated Smooth Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div
        id="question_card"
        className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6"
      >
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
            Q{currentQuestion.questionNumber || currentIndex + 1} • One-Mark
          </span>
          {session.mode === 'wrong_review' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <Flame className="w-3 h-3" />
              Retesting Missed Question
            </span>
          )}
        </div>

        {/* Question Text */}
        <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
          <ChemicalContent content={currentQuestion.question} />
        </div>

        {/* Question Diagram / Image if present */}
        {currentQuestion.imageUrl && (
          <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-inner">
            <img
              src={currentQuestion.imageUrl}
              alt="Question Diagram or Figure"
              className="max-h-72 w-auto max-w-full rounded-xl object-contain mx-auto shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2"
            />
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
              Figure / Diagram associated with question
            </div>
          </div>
        )}

        {/* Multiple-Choice Options */}
        <div className="space-y-3.5 pt-2" id="mcq_options_list">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            const isCorrect = opt.key === currentQuestion.correctAnswer;

            // Determine option card styling based on answer state
            let containerStyle =
              'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-slate-800 dark:text-slate-200';
            let circleStyle =
              'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800';

            if (hasAnswered) {
              if (isCorrect) {
                containerStyle =
                  'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20';
                circleStyle = 'bg-emerald-500 border-emerald-500 text-white font-bold';
              } else if (isSelected && !isCorrect) {
                containerStyle =
                  'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-semibold ring-2 ring-rose-500/20';
                circleStyle = 'bg-rose-500 border-rose-500 text-white font-bold';
              } else {
                containerStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={opt.key}
                id={`option_${opt.key}`}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(opt.key)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-150 flex items-center gap-4 cursor-pointer disabled:cursor-default ${containerStyle}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm font-extrabold flex-shrink-0 transition-colors ${circleStyle}`}
                >
                  {opt.key}
                </div>
                <div className="text-base sm:text-lg flex-1 leading-snug">
                  <ChemicalContent content={opt.text} />
                </div>
                {hasAnswered && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* 9. INSTANT ANSWER SYSTEM FEEDBACK */}
        {hasAnswered && (
          <div
            id="instant_answer_feedback"
            className={`p-5 rounded-2xl border transition-all animate-fadeIn space-y-3 ${
              isCurrentCorrect
                ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCurrentCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-lg font-black text-emerald-800 dark:text-emerald-300">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  <span className="text-lg font-black text-rose-800 dark:text-rose-300">
                    Incorrect
                  </span>
                </>
              )}
            </div>

            {/* Answer details */}
            <div className="text-sm space-y-1">
              {!isCurrentCorrect && selectedOption && (
                <div className="text-rose-800 dark:text-rose-300 font-medium flex items-start gap-1">
                  <span className="font-bold flex-shrink-0">Your Answer: </span>
                  <span>{selectedOption}. </span>
                  <ChemicalContent content={getOptionLetterText(selectedOption)} />
                </div>
              )}
              <div className="text-emerald-800 dark:text-emerald-300 font-bold flex items-start gap-1">
                <span className="flex-shrink-0">Correct Answer: </span>
                <span>{currentQuestion.correctAnswer}. </span>
                <ChemicalContent content={getOptionLetterText(currentQuestion.correctAnswer)} />
              </div>
            </div>

            {/* Optional Explanation */}
            {currentQuestion.explanation && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <strong className="font-semibold text-slate-700 dark:text-slate-300">Explanation: </strong>
                  <ChemicalContent content={currentQuestion.explanation} className="mt-1" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Next Button */}
        {hasAnswered && (
          <div className="pt-4 flex justify-end">
            <button
              id="next_question_btn"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{currentIndex + 1 >= total ? 'Complete Practice 🎉' : 'Next Question'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Keyboard Helper Footer */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500">
        Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">A</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">B</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">C</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">D</kbd> to answer, and <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">Enter</kbd> to proceed.
      </div>

      {/* Pause / Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pause Practice Session?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your progress up to Question {currentIndex + 1} of {total} is safely stored locally. You can resume at any time from the Home screen.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Practicing
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  goBack();
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs cursor-pointer"
              >
                Save & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

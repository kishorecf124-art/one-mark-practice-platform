import React, { useState, useRef } from 'react';
import {
  FileUp,
  FileText,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Layers,
  Shuffle,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';
import {
  extractTextFromPdfFile,
  parseQuestionDocument,
  parseAnswerKeyDocument,
  matchQuestionsWithAnswers,
  SAMPLE_SEPARATE_QUESTIONS_PDF,
  SAMPLE_SEPARATE_ANSWER_PDF,
} from '../utils/pdfParser';

interface SubjectPdfUploadModalProps {
  subjectId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFileState {
  name: string;
  text: string;
  count: number;
}

export const SubjectPdfUploadModal: React.FC<SubjectPdfUploadModalProps> = ({
  subjectId,
  isOpen,
  onClose,
}) => {
  const {
    refreshData,
    showToast,
    startSubjectRandomPractice,
    navigateUnitList,
  } = useApp();

  const subject = storage.getSubject(subjectId);

  const [questionsFile, setQuestionsFile] = useState<UploadedFileState | null>(null);
  const [answerFile, setAnswerFile] = useState<UploadedFileState | null>(null);
  const [isReadingQ, setIsReadingQ] = useState(false);
  const [isReadingA, setIsReadingA] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [successResult, setSuccessResult] = useState<{
    matchedCount: number;
    totalQuestions: number;
    totalAnswers: number;
  } | null>(null);

  const questionsInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !subject) return null;

  const handleQuestionsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setIsReadingQ(true);
    try {
      const text = await extractTextFromPdfFile(file);
      const parsed = parseQuestionDocument(text, subject.name);
      let totalQ = 0;
      parsed.units.forEach((u) => (totalQ += u.questions.length));
      totalQ += parsed.unassignedQuestions.length;

      if (totalQ === 0) {
        setErrorMessage(
          'Could not detect standard one-mark questions in the Questions file. Please ensure questions are numbered (e.g. 1., Q1.) with options A, B, C, D.'
        );
      }

      setQuestionsFile({
        name: file.name,
        text,
        count: totalQ,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error reading Questions PDF file');
    } finally {
      setIsReadingQ(false);
    }
  };

  const handleAnswerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setIsReadingA(true);
    try {
      const text = await extractTextFromPdfFile(file);
      const parsedAnswers = parseAnswerKeyDocument(text);

      if (parsedAnswers.length === 0) {
        setErrorMessage(
          'Could not detect answer keys in the Answer file. Expected format: 1. A, 2. B or 1 - (B), etc.'
        );
      }

      setAnswerFile({
        name: file.name,
        text,
        count: parsedAnswers.length,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error reading Answer PDF file');
    } finally {
      setIsReadingA(false);
    }
  };

  const handleUseSampleQuestions = () => {
    const text = SAMPLE_SEPARATE_QUESTIONS_PDF;
    const parsed = parseQuestionDocument(text, subject.name);
    let totalQ = 0;
    parsed.units.forEach((u) => (totalQ += u.questions.length));
    totalQ += parsed.unassignedQuestions.length;
    setQuestionsFile({
      name: 'Sample_Questions_Paper.pdf',
      text,
      count: totalQ,
    });
    setErrorMessage(null);
  };

  const handleUseSampleAnswers = () => {
    const text = SAMPLE_SEPARATE_ANSWER_PDF;
    const parsed = parseAnswerKeyDocument(text);
    setAnswerFile({
      name: 'Sample_Answer_Key.pdf',
      text,
      count: parsed.length,
    });
    setErrorMessage(null);
  };

  const handleProcessAndMatch = () => {
    if (!questionsFile || !answerFile) {
      setErrorMessage('Please upload both the Questions PDF and the Answer PDF first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Parse questions document
      const questionsParsed = parseQuestionDocument(questionsFile.text, subject.name);

      // 2. Parse answer document
      const answersParsed = parseAnswerKeyDocument(answerFile.text);

      // 3. Match questions with answers
      const matched = matchQuestionsWithAnswers(questionsParsed, answersParsed);

      if (matched.totalQuestions === 0) {
        throw new Error('No questions found to match in the Questions PDF.');
      }

      // 4. Format units for saving
      const unitsToSave: Array<{
        name: string;
        questions: Array<{
          question: string;
          optionA: string;
          optionB: string;
          optionC: string;
          optionD: string;
          correctAnswer: any;
          explanation?: string;
        }>;
      }> = [];

      matched.units.forEach((u) => {
        unitsToSave.push({
          name: u.name,
          questions: u.questions.map((q) => ({
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        });
      });

      if (matched.unassignedQuestions.length > 0) {
        unitsToSave.push({
          name: unitsToSave.length === 0 ? 'Unit 1: Question Bank' : 'Additional Questions',
          questions: matched.unassignedQuestions.map((q) => ({
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        });
      }

      // 5. Save locally for this subject
      storage.saveQuestionsToSubjectId(subject.id, unitsToSave);
      refreshData();

      setSuccessResult({
        matchedCount: matched.matchedCount,
        totalQuestions: matched.totalQuestions,
        totalAnswers: matched.totalAnswersFound,
      });

      showToast(
        `Successfully matched and saved ${matched.totalQuestions} questions for ${subject.name}!`,
        'success'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing and matching PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetModal = () => {
    setQuestionsFile(null);
    setAnswerFile(null);
    setSuccessResult(null);
    setErrorMessage(null);
    onClose();
  };

  const bothUploaded = !!questionsFile && !!answerFile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center shadow-xs">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Upload PDF — {subject.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload Questions PDF and Answer PDF to match and practice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetModal}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {/* Small Success Confirmation Screen */}
        {successResult ? (
          <div className="space-y-6 py-2 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">
                  Successfully Matched & Saved!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Matched {successResult.matchedCount} of {successResult.totalQuestions} questions with their corresponding answers for{' '}
                  <span className="font-bold">{subject.name}</span>.
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="block text-slate-500 text-[10px] uppercase tracking-wider font-bold">Questions</span>
                  <span className="text-sm font-extrabold">{successResult.totalQuestions}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="block text-slate-500 text-[10px] uppercase tracking-wider font-bold">Answers Matched</span>
                  <span className="text-sm font-extrabold">{successResult.matchedCount}</span>
                </div>
              </div>
            </div>

            {/* Start Practice Actions */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Start Practicing Now
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="btn_start_uploaded_random_practice"
                  type="button"
                  onClick={() => {
                    handleResetModal();
                    startSubjectRandomPractice(subject.id);
                  }}
                  className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Start Random Practice</span>
                </button>

                <button
                  id="btn_start_uploaded_unit_practice"
                  type="button"
                  onClick={() => {
                    handleResetModal();
                    navigateUnitList(subject.id);
                  }}
                  className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Unit Wise Practice</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetModal}
                className="w-full py-2.5 text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium cursor-pointer"
              >
                Return to Subject Hub
              </button>
            </div>
          </div>
        ) : (
          /* EXACTLY 2 OPTIONS DISPLAY */
          <div className="space-y-5">
            {/* Hidden native file inputs */}
            <input
              type="file"
              ref={questionsInputRef}
              onChange={handleQuestionsFileUpload}
              accept=".pdf,.txt,.md"
              className="hidden"
            />
            <input
              type="file"
              ref={answerInputRef}
              onChange={handleAnswerFileUpload}
              accept=".pdf,.txt,.md"
              className="hidden"
            />

            {/* Option 1: Questions PDF */}
            <div
              id="card_option_questions_pdf"
              className={`p-4 rounded-2xl border transition-all ${
                questionsFile
                  ? 'border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                      questionsFile
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Questions PDF
                      </h3>
                      {questionsFile && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                          Uploaded
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload the Question Paper with questions and options (A-D)
                    </p>
                  </div>
                </div>

                {questionsFile ? (
                  <button
                    type="button"
                    onClick={() => questionsInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Replace
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => questionsInputRef.current?.click()}
                    disabled={isReadingQ}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isReadingQ ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileUp className="w-3.5 h-3.5" />
                    )}
                    <span>Upload Questions PDF</span>
                  </button>
                )}
              </div>

              {/* Status details if uploaded */}
              {questionsFile ? (
                <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
                    📄 {questionsFile.name}
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {questionsFile.count} Questions detected
                  </span>
                </div>
              ) : (
                <div className="mt-2.5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleUseSampleQuestions}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Load Sample Questions text
                  </button>
                </div>
              )}
            </div>

            {/* Option 2: Answer PDF */}
            <div
              id="card_option_answer_pdf"
              className={`p-4 rounded-2xl border transition-all ${
                answerFile
                  ? 'border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                      answerFile
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Answer PDF
                      </h3>
                      {answerFile && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                          Uploaded
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload the Answer Key containing question numbers and correct options (e.g. 1. B, 2. C)
                    </p>
                  </div>
                </div>

                {answerFile ? (
                  <button
                    type="button"
                    onClick={() => answerInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Replace
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => answerInputRef.current?.click()}
                    disabled={isReadingA}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isReadingA ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileUp className="w-3.5 h-3.5" />
                    )}
                    <span>Upload Answer PDF</span>
                  </button>
                )}
              </div>

              {/* Status details if uploaded */}
              {answerFile ? (
                <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
                    🔑 {answerFile.name}
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {answerFile.count} Answer keys detected
                  </span>
                </div>
              ) : (
                <div className="mt-2.5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleUseSampleAnswers}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Load Sample Answers text
                  </button>
                </div>
              )}
            </div>

            {/* Guidance banner based on current upload state */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                {!questionsFile && !answerFile && (
                  <>Step 1: Upload the Questions PDF. Then Step 2: Upload the Answer PDF.</>
                )}
                {questionsFile && !answerFile && (
                  <>Questions PDF uploaded! Now please upload the Answer PDF to match.</>
                )}
                {!questionsFile && answerFile && (
                  <>Answer PDF uploaded! Now please upload the Questions PDF to match.</>
                )}
                {bothUploaded && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Both PDFs uploaded! Ready to process and match questions with answers.
                  </span>
                )}
              </span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                id="btn_process_and_match_pdfs"
                type="button"
                onClick={handleProcessAndMatch}
                disabled={!bothUploaded || isProcessing}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  bothUploaded
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing & Matching Questions with Answers...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {bothUploaded
                        ? 'Process & Match Questions with Answers'
                        : 'Upload both PDFs to Process & Match'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetModal}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

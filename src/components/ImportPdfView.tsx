import React, { useState, useEffect, useRef } from 'react';
import {
  FileUp,
  FileText,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Layers,
  Save,
  ArrowRight,
  ArrowLeft,
  FolderPlus,
  BookOpen,
  X,
  Copy,
  Check,
  Download,
  Sparkles,
  Calculator,
  Loader2,
  AlertTriangle,
  Play,
  Shuffle,
  RefreshCw,
} from 'lucide-react';
import {
  parseQuestionDocument,
  extractTextFromPdfFile,
  parseAnswerKeyDocument,
  matchQuestionsWithAnswers,
  ParsedQuestionItem,
  ParseResult,
  MATH_PDF_TEMPLATE_EXAMPLE,
  SAMPLE_PDF_PRESETS,
  SAMPLE_SEPARATE_QUESTIONS_PDF,
  SAMPLE_SEPARATE_ANSWER_PDF,
} from '../utils/pdfParser';
import { AnswerOption } from '../types';
import * as storage from '../utils/storage';
import { useApp } from '../context/AppContext';

interface UploadedFileState {
  name: string;
  text: string;
  count: number;
}

export const ImportPdfView: React.FC = () => {
  const { subjects, refreshData, showToast, navigateSubjectDetail, goBack, startSubjectRandomPractice } = useApp();

  // Active mode in Import PDF
  const [activeTab, setActiveTab] = useState<'two_pdf' | 'single_pdf'>('two_pdf');

  // Common Subject Selection
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() => subjects[0]?.id || '');
  const [newSubjectNameInput, setNewSubjectNameInput] = useState<string>('');
  const [isCreatingNewSubject, setIsCreatingNewSubject] = useState<boolean>(false);

  useEffect(() => {
    if (subjects.length > 0 && (!selectedSubjectId || !subjects.some((s) => s.id === selectedSubjectId))) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // ==========================================
  // TAB 1: 2-PDF MATCHING STATE & LOGIC
  // ==========================================
  const [questionsFile, setQuestionsFile] = useState<UploadedFileState | null>(null);
  const [answerFile, setAnswerFile] = useState<UploadedFileState | null>(null);
  const [isReadingQ, setIsReadingQ] = useState<boolean>(false);
  const [isReadingA, setIsReadingA] = useState<boolean>(false);
  const [isProcessing2Pdf, setIsProcessing2Pdf] = useState<boolean>(false);
  const [error2Pdf, setError2Pdf] = useState<string | null>(null);
  const [success2Pdf, setSuccess2Pdf] = useState<{
    matchedCount: number;
    totalQuestions: number;
    totalAnswers: number;
    subjectId: string;
    subjectName: string;
  } | null>(null);

  const questionsInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError2Pdf(null);
    setIsReadingQ(true);
    try {
      const text = await extractTextFromPdfFile(file);
      const targetSubjName = selectedSubject ? selectedSubject.name : 'General';
      const parsed = parseQuestionDocument(text, targetSubjName);
      let totalQ = 0;
      parsed.units.forEach((u) => (totalQ += u.questions.length));
      totalQ += parsed.unassignedQuestions.length;

      if (totalQ === 0) {
        setError2Pdf(
          'Could not detect standard one-mark questions in the Questions file. Please ensure questions are numbered (e.g. 1., Q1.) with options A, B, C, D.'
        );
      }

      setQuestionsFile({
        name: file.name,
        text,
        count: totalQ,
      });
      showToast(`Extracted ${totalQ} questions from ${file.name}`, 'info');
    } catch (err: any) {
      setError2Pdf(err.message || 'Error reading Questions PDF file');
    } finally {
      setIsReadingQ(false);
    }
  };

  const handleAnswerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError2Pdf(null);
    setIsReadingA(true);
    try {
      const text = await extractTextFromPdfFile(file);
      const parsedAnswers = parseAnswerKeyDocument(text);

      if (parsedAnswers.length === 0) {
        setError2Pdf(
          'Could not detect answer keys in the Answer file. Expected format: 1. A, 2. B or 1 - (B), etc.'
        );
      }

      setAnswerFile({
        name: file.name,
        text,
        count: parsedAnswers.length,
      });
      showToast(`Extracted ${parsedAnswers.length} answer keys from ${file.name}`, 'info');
    } catch (err: any) {
      setError2Pdf(err.message || 'Error reading Answer PDF file');
    } finally {
      setIsReadingA(false);
    }
  };

  const handleUseSampleQuestions = () => {
    const targetSubjName = selectedSubject ? selectedSubject.name : 'Mathematics';
    const text = SAMPLE_SEPARATE_QUESTIONS_PDF;
    const parsed = parseQuestionDocument(text, targetSubjName);
    let totalQ = 0;
    parsed.units.forEach((u) => (totalQ += u.questions.length));
    totalQ += parsed.unassignedQuestions.length;
    setQuestionsFile({
      name: 'Sample_Questions_Paper.pdf',
      text,
      count: totalQ,
    });
    setError2Pdf(null);
    showToast(`Loaded ${totalQ} sample questions`, 'info');
  };

  const handleUseSampleAnswers = () => {
    const text = SAMPLE_SEPARATE_ANSWER_PDF;
    const parsed = parseAnswerKeyDocument(text);
    setAnswerFile({
      name: 'Sample_Answer_Key.pdf',
      text,
      count: parsed.length,
    });
    setError2Pdf(null);
    showToast(`Loaded ${parsed.length} sample answer keys`, 'info');
  };

  const handleProcess2PdfMatch = () => {
    if (!questionsFile || !answerFile) {
      setError2Pdf('Please upload both Option 1 (Questions PDF) and Option 2 (Answer Keys PDF).');
      return;
    }

    if (!selectedSubject) {
      setError2Pdf('Please select a target subject.');
      return;
    }

    setIsProcessing2Pdf(true);
    setError2Pdf(null);

    try {
      const questionsParsed = parseQuestionDocument(questionsFile.text, selectedSubject.name);
      const answersParsed = parseAnswerKeyDocument(answerFile.text);
      const matched = matchQuestionsWithAnswers(questionsParsed, answersParsed);

      if (matched.totalQuestions === 0) {
        throw new Error('No questions found to match in the Questions PDF.');
      }

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
            imageUrl: q.imageUrl,
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
            imageUrl: q.imageUrl,
          })),
        });
      }

      storage.saveQuestionsToSubjectId(selectedSubject.id, unitsToSave);
      refreshData();

      setSuccess2Pdf({
        matchedCount: matched.matchedCount,
        totalQuestions: matched.totalQuestions,
        totalAnswers: matched.totalAnswersFound,
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
      });

      showToast(
        `Successfully matched and saved ${matched.totalQuestions} questions to ${selectedSubject.name}!`,
        'success'
      );
    } catch (err: any) {
      setError2Pdf(err.message || 'Error processing and matching PDFs.');
    } finally {
      setIsProcessing2Pdf(false);
    }
  };

  const handleReset2Pdf = () => {
    setQuestionsFile(null);
    setAnswerFile(null);
    setError2Pdf(null);
    setSuccess2Pdf(null);
    if (questionsInputRef.current) questionsInputRef.current.value = '';
    if (answerInputRef.current) answerInputRef.current.value = '';
  };

  // ==========================================
  // TAB 2: SINGLE PDF / TEXT PASTE PREVIEW STATE
  // ==========================================
  const [stepSingle, setStepSingle] = useState<'upload' | 'preview'>('upload');
  const [uploadMode, setUploadMode] = useState<'file' | 'paste'>('file');
  const [pasteText, setPasteText] = useState<string>('');
  const [isProcessingSingle, setIsProcessingSingle] = useState<boolean>(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [copiedFormat, setCopiedFormat] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    unitName: string;
    question: ParsedQuestionItem;
  } | null>(null);

  // Parse pasted text directly
  const handleParsePastedText = () => {
    if (!pasteText.trim()) {
      showToast('Please paste question text first', 'error');
      return;
    }
    setIsProcessingSingle(true);
    try {
      const chosenSubj = selectedSubject ? selectedSubject.name : 'Mathematics';
      const parsed = parseQuestionDocument(pasteText, chosenSubj);
      setParseResult(parsed);
      setStepSingle('preview');
      const count = parsed.units.reduce((a, b) => a + b.questions.length, 0) + parsed.unassignedQuestions.length;
      showToast(`Parsed ${count} questions successfully!`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error parsing text', 'error');
    } finally {
      setIsProcessingSingle(false);
    }
  };

  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingSingle(true);
    try {
      const text = await extractTextFromPdfFile(file);
      const chosenSubj = selectedSubject ? selectedSubject.name : 'General';
      const parsed = parseQuestionDocument(text, chosenSubj);
      setParseResult(parsed);
      setStepSingle('preview');
      showToast(`Extracted ${file.name} successfully!`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error processing document', 'error');
    } finally {
      setIsProcessingSingle(false);
    }
  };

  // Load preset sample into paste text
  const handleLoadPreset = (presetContent: string, presetSubject: string) => {
    setPasteText(presetContent);
    const matched = subjects.find((s) => s.name.toLowerCase() === presetSubject.toLowerCase());
    if (matched) {
      setSelectedSubjectId(matched.id);
    }
    setUploadMode('paste');
    showToast(`Loaded ${presetSubject} template into paste box`, 'info');
  };

  // Delete question from preview
  const handleDeleteQuestion = (unitName: string, questionId: string) => {
    if (!parseResult) return;
    if (unitName === 'unassigned') {
      setParseResult({
        ...parseResult,
        unassignedQuestions: parseResult.unassignedQuestions.filter((q) => q.id !== questionId),
      });
    } else {
      setParseResult({
        ...parseResult,
        units: parseResult.units.map((u) => {
          if (u.name === unitName) {
            return {
              ...u,
              questions: u.questions.filter((q) => q.id !== questionId),
            };
          }
          return u;
        }),
      });
    }
    showToast('Question removed from preview', 'info');
  };

  // Save edited question
  const handleSaveEditedQuestion = (updated: ParsedQuestionItem, originalUnitName: string) => {
    if (!parseResult) return;
    const targetUnitName = updated.unitDetectedName;
    let newUnits = [...parseResult.units];
    let newUnassigned = [...parseResult.unassignedQuestions];

    if (originalUnitName === 'unassigned') {
      newUnassigned = newUnassigned.filter((q) => q.id !== updated.id);
    } else {
      newUnits = newUnits.map((u) => {
        if (u.name === originalUnitName) {
          return {
            ...u,
            questions: u.questions.filter((q) => q.id !== updated.id),
          };
        }
        return u;
      });
    }

    let targetUnit = newUnits.find((u) => u.name === targetUnitName);
    if (!targetUnit) {
      targetUnit = { name: targetUnitName, questions: [] };
      newUnits.push(targetUnit);
    }
    targetUnit.questions.push(updated);

    setParseResult({
      ...parseResult,
      units: newUnits,
      unassignedQuestions: newUnassigned,
    });
    setEditingQuestion(null);
    showToast('Question updated', 'success');
  };

  // Move unassigned question to unit
  const handleAssignUnit = (question: ParsedQuestionItem, targetUnitName: string) => {
    if (!parseResult) return;
    const updatedUnits = [...parseResult.units];
    let targetUnit = updatedUnits.find((u) => u.name === targetUnitName);
    if (!targetUnit) {
      targetUnit = { name: targetUnitName, questions: [] };
      updatedUnits.push(targetUnit);
    }
    targetUnit.questions.push({ ...question, unitDetectedName: targetUnitName });

    setParseResult({
      ...parseResult,
      units: updatedUnits,
      unassignedQuestions: parseResult.unassignedQuestions.filter((q) => q.id !== question.id),
    });
    showToast(`Assigned to ${targetUnitName}`, 'success');
  };

  // Save Question Bank Locally
  const handleConfirmSaveQuestionBank = () => {
    if (!parseResult || !selectedSubject) return;

    const totalCount =
      parseResult.units.reduce((sum, u) => sum + u.questions.length, 0) +
      parseResult.unassignedQuestions.length;

    if (totalCount === 0) {
      showToast('No questions to save.', 'error');
      return;
    }

    const unitsPayload: Array<{
      name: string;
      questions: Array<{
        question: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctAnswer: AnswerOption;
        explanation?: string;
      }>;
    }> = [];

    for (const u of parseResult.units) {
      if (u.questions.length > 0) {
        unitsPayload.push({
          name: u.name,
          questions: u.questions.map((q) => ({
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            imageUrl: q.imageUrl,
          })),
        });
      }
    }

    if (parseResult.unassignedQuestions.length > 0) {
      unitsPayload.push({
        name: 'Unit: General Questions',
        questions: parseResult.unassignedQuestions.map((q) => ({
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          imageUrl: q.imageUrl,
        })),
      });
    }

    const { subjectId, totalQuestions } = storage.saveImportedQuestionBank(
      selectedSubject.name,
      unitsPayload
    );

    refreshData();
    showToast(`Saved ${totalQuestions} questions to ${selectedSubject.name}!`, 'success');
    navigateSubjectDetail(subjectId);
  };

  // Load all 12 units of 12th Maths
  const handleLoadAllMathQuestions = () => {
    const res = storage.loadMathQuestionBank();
    refreshData();
    showToast(`Loaded all 12 units of 12th Maths (${res.totalMathQuestions} questions ready)!`, 'success');
    const mathSubj = subjects.find(
      (s) => s.id === 'subj_math' || s.name.toLowerCase() === 'mathematics'
    );
    if (mathSubj) {
      navigateSubjectDetail(mathSubj.id);
    }
  };

  // Copy template text
  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(MATH_PDF_TEMPLATE_EXAMPLE);
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 2000);
    showToast('Maths PDF format template copied to clipboard!', 'success');
  };

  const handleCreateNewSubject = () => {
    if (!newSubjectNameInput.trim()) {
      showToast('Please enter a subject name', 'error');
      return;
    }
    const newSubj = storage.addSubject({
      name: newSubjectNameInput.trim(),
      description: 'Custom imported subject',
      icon: 'BookOpen',
      color: 'indigo',
    });
    refreshData();
    setSelectedSubjectId(newSubj.id);
    setNewSubjectNameInput('');
    setIsCreatingNewSubject(false);
    showToast(`Created subject "${newSubj.name}"!`, 'success');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header with Inline Subject Selection */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Back to previous screen"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                <FileUp className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Import PDF Questions
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload questions and answer keys offline. Questions will be automatically paired and saved.
          </p>
        </div>

        {/* Compact Inline Subject Selector */}
        <div className="flex items-center gap-2 flex-shrink-0 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider">
            Subject:
          </span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {!isCreatingNewSubject ? (
            <button
              type="button"
              onClick={() => setIsCreatingNewSubject(true)}
              className="p-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold cursor-pointer"
              title="Create New Subject"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="New name..."
                value={newSubjectNameInput}
                onChange={(e) => setNewSubjectNameInput(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleCreateNewSubject}
                className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNewSubject(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Mode Selector */}
      <div className="flex items-center justify-between gap-3 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => setActiveTab('two_pdf')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'two_pdf'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Match 2 PDFs (Question Paper + Answer Key)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('single_pdf')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'single_pdf'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Single PDF / Text Paste</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 2-PDF MATCHING INTERFACE (OPTION 1 + OPTION 2) */}
      {/* ========================================================================= */}
      {activeTab === 'two_pdf' && (
        <div className="space-y-6">
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-800 dark:text-slate-200 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                2-Step Upload for Separate Questions and Answer Key Documents:
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Step 1: Upload your questions paper (Q1, Q2... with A, B, C, D options).<br />
                Step 2: Upload your answer key paper (1. A, 2. B, 3. C...). The engine automatically pairs each question with its correct answer and saves it to <strong>{selectedSubject?.name}</strong>.
              </p>
            </div>
          </div>

          {/* Error Message Banner */}
          {error2Pdf && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Error Processing PDF</p>
                <p className="mt-0.5">{error2Pdf}</p>
              </div>
              <button
                type="button"
                onClick={() => setError2Pdf(null)}
                className="p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Success Result Card */}
          {success2Pdf && (
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/60 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                    PDF Import & Auto-Match Complete!
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Questions and answer keys have been matched and saved directly to {success2Pdf.subjectName}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 text-center">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Total Questions</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {success2Pdf.totalQuestions}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Answer Keys Found</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {success2Pdf.totalAnswers}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Auto-Matched</div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {success2Pdf.matchedCount}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigateSubjectDetail(success2Pdf.subjectId)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Go to {success2Pdf.subjectName} Practice Hub</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset2Pdf}
                  className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Import Another PDF
                </button>
              </div>
            </div>
          )}

          {/* TWO OPTION BOXES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OPTION 1: QUESTIONS PDF */}
            <div
              id="box_option1_questions_pdf"
              className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                questionsFile
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-indigo-600 text-white uppercase tracking-wider">
                    Option 1
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Questions PDF / Document
                  </h3>
                </div>
                {questionsFile && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{questionsFile.count} Qs</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload the PDF containing one-mark questions and options (A, B, C, D). UNIT headings (e.g. UNIT 1 to 12) will be detected automatically.
              </p>

              {/* Upload or Drop Action */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-3">
                <input
                  ref={questionsInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.json"
                  className="hidden"
                  onChange={handleQuestionsFileUpload}
                  id="questions_pdf_upload_input"
                />

                {isReadingQ ? (
                  <div className="py-4 flex flex-col items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-bold">Reading Questions PDF...</span>
                  </div>
                ) : questionsFile ? (
                  <div className="py-2 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{questionsFile.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Questions detected: {questionsFile.count}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuestionsFile(null);
                          if (questionsInputRef.current) questionsInputRef.current.value = '';
                        }}
                        className="text-xs text-rose-500 hover:underline cursor-pointer"
                      >
                        Change file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 space-y-2">
                    <label
                      htmlFor="questions_pdf_upload_input"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>Choose Questions PDF</span>
                    </label>
                    <div className="text-[11px] text-slate-400">PDF, TXT, or MD files</div>
                  </div>
                )}
              </div>

              {/* Sample Action */}
              <button
                type="button"
                onClick={handleUseSampleQuestions}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Questions Document</span>
              </button>
            </div>

            {/* OPTION 2: ANSWER KEY PDF */}
            <div
              id="box_option2_answers_pdf"
              className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                answerFile
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    Option 2
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Answer Key PDF / Document
                  </h3>
                </div>
                {answerFile && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{answerFile.count} Keys</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload the answer key document (e.g. 1. A, 2. B, 3. C, 4. D or 1 - (b), etc.). The engine parses each question number to its correct answer.
              </p>

              {/* Upload or Drop Action */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-3">
                <input
                  ref={answerInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.json"
                  className="hidden"
                  onChange={handleAnswerFileUpload}
                  id="answers_pdf_upload_input"
                />

                {isReadingA ? (
                  <div className="py-4 flex flex-col items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-bold">Reading Answer Key PDF...</span>
                  </div>
                ) : answerFile ? (
                  <div className="py-2 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{answerFile.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Answer keys detected: {answerFile.count}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAnswerFile(null);
                          if (answerInputRef.current) answerInputRef.current.value = '';
                        }}
                        className="text-xs text-rose-500 hover:underline cursor-pointer"
                      >
                        Change file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 space-y-2">
                    <label
                      htmlFor="answers_pdf_upload_input"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>Choose Answer Keys PDF</span>
                    </label>
                    <div className="text-[11px] text-slate-400">PDF, TXT, or MD files</div>
                  </div>
                )}
              </div>

              {/* Sample Action */}
              <button
                type="button"
                onClick={handleUseSampleAnswers}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Answer Keys</span>
              </button>
            </div>
          </div>

          {/* Match & Save Action Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
              <span>Target: </span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {selectedSubject?.name}
              </strong>
              <span className="mx-2">•</span>
              <span>
                {questionsFile ? `${questionsFile.count} Questions` : 'No Questions PDF'} +{' '}
                {answerFile ? `${answerFile.count} Answers` : 'No Answer PDF'}
              </span>
            </div>

            <button
              id="btn_execute_2_pdf_match"
              type="button"
              onClick={handleProcess2PdfMatch}
              disabled={!questionsFile || !answerFile || isProcessing2Pdf}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              {isProcessing2Pdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching Questions & Answers...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Match & Save to {selectedSubject?.name}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SINGLE PDF / TEXT PASTE PREVIEW INTERFACE */}
      {/* ========================================================================= */}
      {activeTab === 'single_pdf' && (
        <div className="space-y-6">
          {stepSingle === 'upload' ? (
            <div className="space-y-6">
              {/* Quick Action: Official TN 12th Maths Question Bank */}
              <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        TN 12th Maths Question Bank (250 MCQs)
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 uppercase tracking-wide">
                        Units 1 – 12
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                      Complete Tamil Nadu 12th State Board Mathematics Book Back one-mark questions with answers, options, and step-by-step explanations ready for practice!
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowTemplateModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Maths PDF Format</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadAllMathQuestions}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Load All 12 Units (250 MCQs)</span>
                  </button>
                </div>
              </div>

              {/* Upload Method Tabs: File Upload vs Direct Paste */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs">
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
                      uploadMode === 'file'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileUp className="w-4 h-4" />
                    <span>Upload Combined PDF or Text File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('paste')}
                    className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
                      uploadMode === 'paste'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Paste Question Text Directly</span>
                  </button>
                </div>

                <div className="p-6">
                  {uploadMode === 'file' ? (
                    <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-center space-y-4 transition-colors">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FileUp className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Upload One-Mark Question PDF with Answers Included
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                          Supports PDF, TXT, and Markdown files. Automatically recognizes UNIT headers (UNIT 1 to 12), questions, options (A-D or 1-4), and answers.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="pdf_single_upload_input"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Choose Document from Computer</span>
                        </label>
                        <input
                          id="pdf_single_upload_input"
                          type="file"
                          accept=".pdf,.txt,.md,.json"
                          className="hidden"
                          onChange={handleSingleFileUpload}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Paste Questions & Options Text:
                          </label>
                          <button
                            type="button"
                            onClick={() => setPasteText(MATH_PDF_TEMPLATE_EXAMPLE)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                          >
                            Load Sample Maths Questions
                          </button>
                        </div>
                        <textarea
                          value={pasteText}
                          onChange={(e) => setPasteText(e.target.value)}
                          placeholder="Paste your questions here...&#10;&#10;UNIT 1: Applications of Matrices and Determinants&#10;1. If |adj (adj A)| = |A|⁹, then the order of the square matrix A is:&#10;(A) 3&#10;(B) 4&#10;(C) 2&#10;(D) 5&#10;Answer: B&#10;Explanation: |adj(adj A)| = |A|^((n-1)²)..."
                          rows={12}
                          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setPasteText('')}
                          className="text-xs text-slate-500 hover:text-rose-600 cursor-pointer"
                        >
                          Clear text
                        </button>
                        <button
                          type="button"
                          onClick={handleParsePastedText}
                          disabled={!pasteText.trim() || isProcessingSingle}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isProcessingSingle ? 'Processing...' : 'Parse & Preview Questions'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Presets Section */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Test with Pre-Formatted Subject Presets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SAMPLE_PDF_PRESETS.map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => handleLoadPreset(preset.content, preset.subject)}
                      className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group cursor-pointer"
                    >
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {preset.subject}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 line-clamp-1">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Click to preview in paste box</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* PREVIEW STEP */
            parseResult && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Units & Questions Detected
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Subject: <strong className="text-slate-900 dark:text-white">{selectedSubject?.name}</strong>
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      Extracted{' '}
                      {parseResult.units.reduce((acc, u) => acc + u.questions.length, 0) +
                        parseResult.unassignedQuestions.length}{' '}
                      Questions across {parseResult.units.length} Units
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Review or edit questions before saving to your offline question bank.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStepSingle('upload')}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      id="confirm_save_question_bank_btn"
                      onClick={handleConfirmSaveQuestionBank}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Question Bank</span>
                    </button>
                  </div>
                </div>

                {/* Units and Questions Groups */}
                <div className="space-y-6">
                  {parseResult.units.map((unitGroup) => (
                    <div
                      key={unitGroup.name}
                      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {unitGroup.name}
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {unitGroup.questions.length} Questions
                        </span>
                      </div>

                      <div className="space-y-3">
                        {unitGroup.questions.map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                                  Q{qIdx + 1}.
                                </span>
                                {q.question}
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() =>
                                    setEditingQuestion({
                                      unitName: unitGroup.name,
                                      question: { ...q },
                                    })
                                  }
                                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 cursor-pointer"
                                  title="Edit question"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(unitGroup.name, q.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="Delete question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className={`p-2 rounded-lg ${q.correctAnswer === 'A' ? 'bg-emerald-100/80 dark:bg-emerald-950/70 font-bold text-emerald-900 dark:text-emerald-200 border border-emerald-300' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                                A. {q.optionA}
                              </div>
                              <div className={`p-2 rounded-lg ${q.correctAnswer === 'B' ? 'bg-emerald-100/80 dark:bg-emerald-950/70 font-bold text-emerald-900 dark:text-emerald-200 border border-emerald-300' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                                B. {q.optionB}
                              </div>
                              <div className={`p-2 rounded-lg ${q.correctAnswer === 'C' ? 'bg-emerald-100/80 dark:bg-emerald-950/70 font-bold text-emerald-900 dark:text-emerald-200 border border-emerald-300' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                                C. {q.optionC}
                              </div>
                              <div className={`p-2 rounded-lg ${q.correctAnswer === 'D' ? 'bg-emerald-100/80 dark:bg-emerald-950/70 font-bold text-emerald-900 dark:text-emerald-200 border border-emerald-300' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                                D. {q.optionD}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Maths Format Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  12th Maths Question PDF Format Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Save your document or paste in this standardized format. The offline parser will detect unit names, options A-D, and step-by-step explanations automatically.
            </p>

            <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-auto flex-1 select-all">
              {MATH_PDF_TEMPLATE_EXAMPLE}
            </pre>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                {copiedFormat ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFormat ? 'Copied!' : 'Copy Template Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question & Diagram Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Question & Diagram
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Text
                </label>
                <textarea
                  value={editingQuestion.question.question}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, question: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  rows={3}
                />
              </div>

              {/* Diagram / Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Diagram / Figure Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={editingQuestion.question.imageUrl || ''}
                  placeholder="https://example.com/diagram.png or data:image/..."
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, imageUrl: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
                {editingQuestion.question.imageUrl && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <img
                      src={editingQuestion.question.imageUrl}
                      alt="Diagram preview"
                      className="max-h-40 mx-auto rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Options A, B, C, D */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Option A</label>
                  <input
                    type="text"
                    value={editingQuestion.question.optionA}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, optionA: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Option B</label>
                  <input
                    type="text"
                    value={editingQuestion.question.optionB}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, optionB: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Option C</label>
                  <input
                    type="text"
                    value={editingQuestion.question.optionC}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, optionC: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Option D</label>
                  <input
                    type="text"
                    value={editingQuestion.question.optionD}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, optionD: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correct Answer</label>
                <select
                  value={editingQuestion.question.correctAnswer}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: {
                        ...editingQuestion.question,
                        correctAnswer: e.target.value as AnswerOption,
                      },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEditedQuestion(editingQuestion.question, editingQuestion.unitName)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

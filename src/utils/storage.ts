import {
  Subject,
  Unit,
  Question,
  WrongQuestionRecord,
  Attempt,
  PracticeSession,
  AnswerOption,
  UserProfile,
} from '../types';
import { INITIAL_SUBJECTS, INITIAL_UNITS, generateInitialQuestions } from '../data/initialData';
import { ALL_MATH_QUESTIONS } from '../data/mathQuestions';
import { ALL_PHYSICS_QUESTIONS } from '../data/physicsQuestions';
import { ALL_CHEMISTRY_QUESTIONS } from '../data/chemistryQuestions';
import { ALL_CS_QUESTIONS } from '../data/csQuestions';

const KEYS = {
  SUBJECTS: 'onemark_subjects_v1',
  UNITS: 'onemark_units_v1',
  QUESTIONS: 'onemark_questions_v1',
  WRONG_QUESTIONS: 'onemark_wrong_questions_v1',
  ATTEMPTS: 'onemark_attempts_v1',
  SESSIONS: 'onemark_sessions_v1',
  ACTIVE_SESSION: 'onemark_active_session_v1',
  THEME: 'onemark_theme_v1',
  USER_PROFILE: 'onequest_user_profile_v1',
};

// Safe JSON helpers with localStorage
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to localStorage`, err);
  }
}

// Initialization of local offline database
export function initializeStorage(): void {
  if (!localStorage.getItem(KEYS.SUBJECTS)) {
    setItem(KEYS.SUBJECTS, INITIAL_SUBJECTS);
  } else {
    // Ensure all canonical subjects (including Computer Science) are present
    const curSubjects = getItem<Subject[]>(KEYS.SUBJECTS, INITIAL_SUBJECTS);
    let updatedSubj = false;
    INITIAL_SUBJECTS.forEach((is) => {
      if (!curSubjects.some((s) => s.id === is.id)) {
        curSubjects.push(is);
        updatedSubj = true;
      }
    });
    if (updatedSubj) {
      setItem(KEYS.SUBJECTS, curSubjects);
    }
  }

  if (!localStorage.getItem(KEYS.UNITS)) {
    setItem(KEYS.UNITS, INITIAL_UNITS);
  } else {
    // Ensure canonical units are present
    const curUnits = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS);
    let updatedUnits = false;
    INITIAL_UNITS.forEach((iu) => {
      if (!curUnits.some((u) => u.id === iu.id)) {
        curUnits.push(iu);
        updatedUnits = true;
      }
    });
    if (updatedUnits) {
      setItem(KEYS.UNITS, curUnits);
    }
  }

  if (!localStorage.getItem(KEYS.QUESTIONS)) {
    setItem(KEYS.QUESTIONS, [
      ...ALL_PHYSICS_QUESTIONS,
      ...ALL_CS_QUESTIONS,
      ...ALL_CHEMISTRY_QUESTIONS,
      ...ALL_MATH_QUESTIONS,
    ]);
  }
  if (!localStorage.getItem(KEYS.WRONG_QUESTIONS)) {
    setItem(KEYS.WRONG_QUESTIONS, []);
  }
  if (!localStorage.getItem(KEYS.ATTEMPTS)) {
    setItem(KEYS.ATTEMPTS, []);
  }
  if (!localStorage.getItem(KEYS.SESSIONS)) {
    setItem(KEYS.SESSIONS, []);
  }

  // Cleanup migration flag: Load all verified PDFs exactly (Physics 150, CS 156, Chemistry 324, Math 250)
  const CLEAN_PHYSICS_FLAG = 'onemark_clean_strict_pdf_curriculum_v15_all_verified';
  if (!localStorage.getItem(CLEAN_PHYSICS_FLAG)) {
    try {
      const existingQuestions = getItem<Question[]>(KEYS.QUESTIONS, []);
      const existingUnits = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS);

      const cleanQMap = new Map<string, Question>();
      // 1. Add all official PDF verified questions
      ALL_PHYSICS_QUESTIONS.forEach((pq) => cleanQMap.set(pq.id, pq));
      ALL_CS_QUESTIONS.forEach((csq) => cleanQMap.set(csq.id, csq));
      ALL_CHEMISTRY_QUESTIONS.forEach((cq) => cleanQMap.set(cq.id, cq));
      ALL_MATH_QUESTIONS.forEach((mq) => cleanQMap.set(mq.id, mq));

      // 2. Preserve any user-created custom subjects
      existingQuestions.forEach((q) => {
        if (
          q.subjectId !== 'subj_physics' &&
          q.subjectId !== 'subj_cs' &&
          q.subjectId !== 'subj_chemistry' &&
          q.subjectId !== 'subj_math'
        ) {
          cleanQMap.set(q.id, q);
        }
      });

      setItem(KEYS.QUESTIONS, Array.from(cleanQMap.values()));

      // Clean units: Keep canonical initial units
      const cleanUnitsMap = new Map<string, Unit>();
      INITIAL_UNITS.forEach((iu) => cleanUnitsMap.set(iu.id, iu));

      existingUnits.forEach((u) => {
        if (
          u.subjectId !== 'subj_physics' &&
          u.subjectId !== 'subj_cs' &&
          u.subjectId !== 'subj_chemistry' &&
          u.subjectId !== 'subj_math'
        ) {
          cleanUnitsMap.set(u.id, u);
        }
      });

      setItem(KEYS.UNITS, Array.from(cleanUnitsMap.values()));
      localStorage.setItem(CLEAN_PHYSICS_FLAG, 'true');
    } catch (err) {
      console.warn('Could not complete curriculum cleanup', err);
    }
  }
}

// Subjects
export function getSubjects(): Subject[] {
  initializeStorage();
  return getItem<Subject[]>(KEYS.SUBJECTS, INITIAL_SUBJECTS);
}

export function getSubject(id: string): Subject | undefined {
  return getSubjects().find((s) => s.id === id);
}

export function addSubject(subjectData: {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}): Subject {
  initializeStorage();
  const subjects = getSubjects();
  
  // Check if subject with this name already exists
  const existing = subjects.find(
    (s) => s.name.toLowerCase().trim() === subjectData.name.toLowerCase().trim()
  );
  if (existing) {
    return existing;
  }

  const newSubject: Subject = {
    id: 'subj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: subjectData.name.trim(),
    description: subjectData.description?.trim() || 'One-mark objective practice questions.',
    icon: subjectData.icon || 'BookOpen',
    color: subjectData.color || 'blue',
  };

  subjects.push(newSubject);
  setItem(KEYS.SUBJECTS, subjects);
  return newSubject;
}

export { INITIAL_SUBJECTS, INITIAL_UNITS };

export function clearSubjectQuestions(subjectId: string, removeCustomUnits: boolean = false): void {
  initializeStorage();
  const questions = getItem<Question[]>(KEYS.QUESTIONS, []).filter((q) => q.subjectId !== subjectId);
  setItem(KEYS.QUESTIONS, questions);

  const wrong = getItem<WrongQuestionRecord[]>(KEYS.WRONG_QUESTIONS, []).filter((w) => w.subjectId !== subjectId);
  setItem(KEYS.WRONG_QUESTIONS, wrong);

  const attempts = getItem<Attempt[]>(KEYS.ATTEMPTS, []).filter((a) => a.subjectId !== subjectId);
  setItem(KEYS.ATTEMPTS, attempts);

  if (removeCustomUnits) {
    const initialUnitsForSubj = INITIAL_UNITS.filter((u) => u.subjectId === subjectId);
    const otherUnits = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS).filter((u) => u.subjectId !== subjectId);
    setItem(KEYS.UNITS, [...otherUnits, ...initialUnitsForSubj]);
  }

  const active = getActiveSession();
  if (active && active.subjectId === subjectId) {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  }
}

export function deleteSubject(subjectId: string): void {
  initializeStorage();
  const subjects = getSubjects().filter((s) => s.id !== subjectId);
  setItem(KEYS.SUBJECTS, subjects);

  const units = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS).filter((u) => u.subjectId !== subjectId);
  setItem(KEYS.UNITS, units);

  const questions = getItem<Question[]>(KEYS.QUESTIONS, []).filter((q) => q.subjectId !== subjectId);
  setItem(KEYS.QUESTIONS, questions);

  const sessions = getSessions().filter((ses) => ses.subjectId !== subjectId);
  setItem(KEYS.SESSIONS, sessions);

  const active = getActiveSession();
  if (active && active.subjectId === subjectId) {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  }
}

// Units
export function getUnits(subjectId?: string): Unit[] {
  initializeStorage();
  const all = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS);
  if (!subjectId) return all;
  return all.filter((u) => u.subjectId === subjectId);
}

export function getUnit(id: string): Unit | undefined {
  return getUnits().find((u) => u.id === id);
}

export function addUnit(subjectId: string, name: string): Unit {
  initializeStorage();
  const units = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS);
  const currentUnitsForSubject = units.filter((u) => u.subjectId === subjectId);
  
  const newUnit: Unit = {
    id: 'unit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    subjectId,
    unitNumber: currentUnitsForSubject.length + 1,
    name: name.trim() || `Unit ${currentUnitsForSubject.length + 1}`,
  };

  units.push(newUnit);
  setItem(KEYS.UNITS, units);
  return newUnit;
}

export function addQuestion(questionData: Omit<Question, 'id'>): Question {
  initializeStorage();
  const questions = getQuestions();
  const newQuestion: Question = {
    ...questionData,
    id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
  };
  questions.push(newQuestion);
  setItem(KEYS.QUESTIONS, questions);
  return newQuestion;
}

// Questions
export function getQuestions(filter?: { subjectId?: string; unitId?: string }): Question[] {
  initializeStorage();
  let list = getItem<Question[]>(KEYS.QUESTIONS, []);
  if (filter?.subjectId) {
    list = list.filter((q) => q.subjectId === filter.subjectId);
  }
  if (filter?.unitId) {
    list = list.filter((q) => q.unitId === filter.unitId);
  }
  return list;
}

export function getQuestion(id: string): Question | undefined {
  const all = getQuestions();
  return all.find((q) => q.id === id);
}

// Wrong Questions
export function getWrongQuestions(filter?: { subjectId?: string; unitId?: string }): WrongQuestionRecord[] {
  initializeStorage();
  let list = getItem<WrongQuestionRecord[]>(KEYS.WRONG_QUESTIONS, []);
  if (filter?.subjectId) {
    list = list.filter((wq) => wq.subjectId === filter.subjectId);
  }
  if (filter?.unitId) {
    list = list.filter((wq) => wq.unitId === filter.unitId);
  }
  return list;
}

export function recordWrongQuestion(question: Question, selectedAnswer: AnswerOption): void {
  const current = getWrongQuestions();
  const existingIdx = current.findIndex((wq) => wq.questionId === question.id);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const existing = current[existingIdx];
    current[existingIdx] = {
      ...existing,
      imageUrl: question.imageUrl || existing.imageUrl,
      lastSelectedAnswer: selectedAnswer,
      lastAttemptDate: now,
      wrongCount: existing.wrongCount + 1,
      mastered: false,
      history: [
        ...(existing.history || []),
        { date: now, selectedAnswer, isCorrect: false },
      ],
    };
  } else {
    current.push({
      questionId: question.id,
      subjectId: question.subjectId,
      unitId: question.unitId,
      question: question.question,
      imageUrl: question.imageUrl,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      lastSelectedAnswer: selectedAnswer,
      lastAttemptDate: now,
      wrongCount: 1,
      mastered: false,
      history: [{ date: now, selectedAnswer, isCorrect: false }],
    });
  }

  setItem(KEYS.WRONG_QUESTIONS, current);
}

export function recordCorrectWrongQuestionReview(questionId: string, selectedAnswer: AnswerOption): void {
  const current = getWrongQuestions();
  const existingIdx = current.findIndex((wq) => wq.questionId === questionId);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const existing = current[existingIdx];
    current[existingIdx] = {
      ...existing,
      lastSelectedAnswer: selectedAnswer,
      lastAttemptDate: now,
      mastered: true, // Marked as improved, kept for tracking history as required
      history: [
        ...(existing.history || []),
        { date: now, selectedAnswer, isCorrect: true },
      ],
    };
    setItem(KEYS.WRONG_QUESTIONS, current);
  }
}

// Attempts
export function recordAttempt(attempt: Omit<Attempt, 'id'>): void {
  const current = getItem<Attempt[]>(KEYS.ATTEMPTS, []);
  const newAttempt: Attempt = {
    ...attempt,
    id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
  };
  current.push(newAttempt);
  setItem(KEYS.ATTEMPTS, current);
}

// Sessions
export function getSessions(): PracticeSession[] {
  return getItem<PracticeSession[]>(KEYS.SESSIONS, []);
}

export function getSession(id: string): PracticeSession | undefined {
  return getSessions().find((s) => s.id === id);
}

export function saveSession(session: PracticeSession): void {
  const current = getSessions();
  const existingIdx = current.findIndex((s) => s.id === session.id);
  if (existingIdx >= 0) {
    current[existingIdx] = session;
  } else {
    current.unshift(session);
  }
  setItem(KEYS.SESSIONS, current);

  // If session is completed, clear active session
  if (session.isCompleted) {
    const active = getActiveSession();
    if (active?.id === session.id) {
      clearActiveSession();
    }
  } else {
    setActiveSession(session);
  }
}

export function getActiveSession(): PracticeSession | null {
  return getItem<PracticeSession | null>(KEYS.ACTIVE_SESSION, null);
}

export function setActiveSession(session: PracticeSession): void {
  setItem(KEYS.ACTIVE_SESSION, session);
}

export function clearActiveSession(): void {
  localStorage.removeItem(KEYS.ACTIVE_SESSION);
}

export function deleteSession(id: string): void {
  const current = getSessions();
  const filtered = current.filter((s) => s.id !== id);
  setItem(KEYS.SESSIONS, filtered);

  const active = getActiveSession();
  if (active?.id === id) {
    clearActiveSession();
  }
}

// Save Imported Questions into Local Storage
export function saveImportedQuestionBank(
  subjectName: string,
  unitsData: Array<{
    name: string;
    questions: Array<{
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: AnswerOption;
      explanation?: string;
      imageUrl?: string;
    }>;
  }>
): { subjectId: string; totalQuestions: number } {
  initializeStorage();
  const subjects = getSubjects();
  let units = getUnits();
  let questions = getQuestions();

  // Find or create subject
  let subject = subjects.find(
    (s) =>
      s.name.toLowerCase() === subjectName.toLowerCase().trim() ||
      (s.name.toLowerCase() === 'computer science' && subjectName.toLowerCase().includes('computer'))
  );

  if (!subject) {
    subject = {
      id: 'subj_' + Date.now(),
      name: subjectName.trim(),
      description: `Imported PDF Question Bank with ${unitsData.length} Units`,
      icon: 'BookOpen',
      color: 'blue',
    };
    subjects.push(subject);
    setItem(KEYS.SUBJECTS, subjects);
  }

  // Clear previous questions for this subject so we don't accumulate duplicates
  questions = questions.filter((q) => q.subjectId !== subject!.id);

  let totalAdded = 0;

  for (let uIdx = 0; uIdx < unitsData.length; uIdx++) {
    const unitItem = unitsData[uIdx];
    const cleanUnitName = unitItem.name.trim();

    // Check if a unit already exists in this subject with matching name or unit number
    let existingUnit = units.find(
      (u) =>
        u.subjectId === subject!.id &&
        (u.name.toLowerCase() === cleanUnitName.toLowerCase() ||
          (cleanUnitName.toLowerCase().startsWith('unit ') &&
            u.name.toLowerCase().startsWith(cleanUnitName.toLowerCase().slice(0, 7))))
    );

    let unitId = existingUnit ? existingUnit.id : '';
    if (!existingUnit) {
      unitId = 'unit_' + Date.now() + '_' + (uIdx + 1);
      const newUnit: Unit = {
        id: unitId,
        subjectId: subject.id,
        unitNumber: units.filter((u) => u.subjectId === subject!.id).length + 1,
        name: cleanUnitName || `Unit ${uIdx + 1}`,
      };
      units.push(newUnit);
    }

    unitItem.questions.forEach((q, qIdx) => {
      questions.push({
        id: 'q_imp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7) + '_' + qIdx,
        subjectId: subject!.id,
        unitId,
        questionNumber: qIdx + 1,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        imageUrl: q.imageUrl,
      });
      totalAdded++;
    });
  }

  setItem(KEYS.UNITS, units);
  setItem(KEYS.QUESTIONS, questions);

  return { subjectId: subject.id, totalQuestions: totalAdded };
}

export function saveQuestionsToSubjectId(
  subjectId: string,
  unitsData: Array<{
    name: string;
    questions: Array<{
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: AnswerOption;
      explanation?: string;
      imageUrl?: string;
    }>;
  }>
): { subjectId: string; totalQuestions: number } {
  initializeStorage();
  const subjects = getSubjects();
  let units = getUnits();
  let questions = getQuestions();

  const subject =
    subjects.find((s) => s.id === subjectId) ||
    subjects.find((s) => s.name.toLowerCase() === subjectId.toLowerCase().trim());
  if (!subject) {
    return saveImportedQuestionBank(subjectId, unitsData);
  }

  // Clear previous questions for this subject so only new PDF questions are present
  questions = questions.filter((q) => q.subjectId !== subject.id);

  let totalAdded = 0;

  for (let uIdx = 0; uIdx < unitsData.length; uIdx++) {
    const unitItem = unitsData[uIdx];
    const cleanUnitName = unitItem.name.trim();

    let existingUnit = units.find(
      (u) =>
        u.subjectId === subject.id &&
        (u.name.toLowerCase() === cleanUnitName.toLowerCase() ||
          (cleanUnitName.toLowerCase().startsWith('unit ') &&
            u.name.toLowerCase().startsWith(cleanUnitName.toLowerCase().slice(0, 7))))
    );

    let unitId = existingUnit ? existingUnit.id : '';
    if (!existingUnit) {
      unitId = 'unit_' + Date.now() + '_' + (uIdx + 1);
      const newUnit: Unit = {
        id: unitId,
        subjectId: subject.id,
        unitNumber: units.filter((u) => u.subjectId === subject.id).length + 1,
        name: cleanUnitName || `Unit ${uIdx + 1}`,
      };
      units.push(newUnit);
    }

    unitItem.questions.forEach((q, qIdx) => {
      questions.push({
        id: 'q_imp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7) + '_' + qIdx,
        subjectId: subject.id,
        unitId,
        questionNumber: qIdx + 1,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        imageUrl: q.imageUrl,
      });
      totalAdded++;
    });
  }

  setItem(KEYS.UNITS, units);
  setItem(KEYS.QUESTIONS, questions);

  return { subjectId: subject.id, totalQuestions: totalAdded };
}

// Load Pre-built Official TN 12th Mathematics Question Bank (250+ Questions across all 12 units)
export function loadMathQuestionBank(): { totalAdded: number; totalMathQuestions: number } {
  initializeStorage();
  const questions = getQuestions();
  const existingMap = new Map<string, Question>();
  questions.forEach((q) => existingMap.set(q.id, q));

  let added = 0;
  for (const q of ALL_MATH_QUESTIONS) {
    if (!existingMap.has(q.id)) {
      existingMap.set(q.id, q);
      added++;
    }
  }

  const updatedQuestions = Array.from(existingMap.values());
  setItem(KEYS.QUESTIONS, updatedQuestions);

  const totalMathQuestions = updatedQuestions.filter((q) => q.subjectId === 'subj_math').length;
  return { totalAdded: added, totalMathQuestions };
}

// Remove/Clear Questions or Units uploaded for a subject
export function removeSubjectQuestions(
  subjectId: string,
  options?: { removeCustomUnits?: boolean }
): { questionsRemoved: number; unitsRemoved: number } {
  initializeStorage();
  const allQuestions = getQuestions();
  const questionsToRemove = allQuestions.filter((q) => q.subjectId === subjectId);
  const remainingQuestions = allQuestions.filter((q) => q.subjectId !== subjectId);
  setItem(KEYS.QUESTIONS, remainingQuestions);

  const removedQIds = new Set(questionsToRemove.map((q) => q.id));

  // Clean wrong questions for this subject
  const wrongQuestions = getWrongQuestions().filter(
    (wq) => wq.subjectId !== subjectId && !removedQIds.has(wq.questionId)
  );
  setItem(KEYS.WRONG_QUESTIONS, wrongQuestions);

  // Clean attempts for removed questions
  const attempts = getItem<Attempt[]>(KEYS.ATTEMPTS, []).filter(
    (a) => !removedQIds.has(a.questionId)
  );
  setItem(KEYS.ATTEMPTS, attempts);

  // Clear active session if it matches this subject
  const active = getActiveSession();
  if (active && active.subjectId === subjectId) {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  }

  // Remove unfinished or finished sessions for this subject
  const sessions = getSessions().filter((s) => s.subjectId !== subjectId);
  setItem(KEYS.SESSIONS, sessions);

  let unitsRemovedCount = 0;
  if (options?.removeCustomUnits) {
    const allUnits = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS);
    const initialUnitsForSubj = INITIAL_UNITS.filter((u) => u.subjectId === subjectId);
    if (initialUnitsForSubj.length > 0) {
      // Revert to default units for standard subjects
      const otherUnits = allUnits.filter((u) => u.subjectId !== subjectId);
      const prevCount = allUnits.filter((u) => u.subjectId === subjectId).length;
      setItem(KEYS.UNITS, [...otherUnits, ...initialUnitsForSubj]);
      unitsRemovedCount = Math.max(0, prevCount - initialUnitsForSubj.length);
    } else {
      // For custom subjects created via PDF, remove all units
      const remainingUnits = allUnits.filter((u) => u.subjectId !== subjectId);
      unitsRemovedCount = allUnits.filter((u) => u.subjectId === subjectId).length;
      setItem(KEYS.UNITS, remainingUnits);
    }
  }

  return {
    questionsRemoved: questionsToRemove.length,
    unitsRemoved: unitsRemovedCount,
  };
}

// Delete a single unit and its questions
export function deleteUnitAndQuestions(unitId: string): { questionsRemoved: number } {
  initializeStorage();
  const allQuestions = getQuestions();
  const qToRemove = allQuestions.filter((q) => q.unitId === unitId);
  const remainingQ = allQuestions.filter((q) => q.unitId !== unitId);
  setItem(KEYS.QUESTIONS, remainingQ);

  const removedIds = new Set(qToRemove.map((q) => q.id));
  const wrongQuestions = getWrongQuestions().filter(
    (wq) => wq.unitId !== unitId && !removedIds.has(wq.questionId)
  );
  setItem(KEYS.WRONG_QUESTIONS, wrongQuestions);

  const attempts = getItem<Attempt[]>(KEYS.ATTEMPTS, []).filter(
    (a) => !removedIds.has(a.questionId)
  );
  setItem(KEYS.ATTEMPTS, attempts);

  const allUnits = getItem<Unit[]>(KEYS.UNITS, INITIAL_UNITS);
  const remainingUnits = allUnits.filter((u) => u.id !== unitId);
  setItem(KEYS.UNITS, remainingUnits);

  return { questionsRemoved: qToRemove.length };
}

// Progress and Analytics calculation
export function getProgressStats() {
  const questions = getQuestions();
  const attempts = getItem<Attempt[]>(KEYS.ATTEMPTS, []);
  const wrongQuestions = getWrongQuestions();
  const subjects = getSubjects();
  const units = getUnits();

  const totalQuestions = questions.length;
  // unique questions attempted
  const attemptedQuestionIds = new Set(attempts.map((a) => a.questionId));
  const questionsAttempted = attemptedQuestionIds.size;

  const totalAttemptsCount = attempts.length;
  const correctAttemptsCount = attempts.filter((a) => a.isCorrect).length;
  const wrongAttemptsCount = totalAttemptsCount - correctAttemptsCount;
  const overallAccuracy =
    totalAttemptsCount > 0 ? Math.round((correctAttemptsCount / totalAttemptsCount) * 100) : 0;

  // Subject-wise stats
  const subjectStats = subjects.map((subj) => {
    const subjQuestions = questions.filter((q) => q.subjectId === subj.id);
    const subjQueryIds = new Set(subjQuestions.map((q) => q.id));
    const subjAttempts = attempts.filter((a) => subjQueryIds.has(a.questionId));
    const subjCorrect = subjAttempts.filter((a) => a.isCorrect).length;
    const subjAccuracy =
      subjAttempts.length > 0 ? Math.round((subjCorrect / subjAttempts.length) * 100) : 0;
    const subjAttemptedUnique = new Set(subjAttempts.map((a) => a.questionId)).size;
    const subjUnits = units.filter((u) => u.subjectId === subj.id);

    // Unit-wise stats inside this subject
    const unitStats = subjUnits.map((u) => {
      const uQuestions = questions.filter((q) => q.unitId === u.id);
      const uIds = new Set(uQuestions.map((q) => q.id));
      const uAttempts = attempts.filter((a) => uIds.has(a.questionId));
      const uCorrect = uAttempts.filter((a) => a.isCorrect).length;
      const uAccuracy =
        uAttempts.length > 0 ? Math.round((uCorrect / uAttempts.length) * 100) : 0;
      return {
        unit: u,
        totalQuestions: uQuestions.length,
        attemptedCount: new Set(uAttempts.map((a) => a.questionId)).size,
        accuracy: uAccuracy,
      };
    });

    return {
      subject: subj,
      totalQuestions: subjQuestions.length,
      unitsCount: subjUnits.length,
      attemptedCount: subjAttemptedUnique,
      accuracy: subjAccuracy,
      unitStats,
    };
  });

  return {
    totalQuestions,
    questionsAttempted,
    totalAttemptsCount,
    correctAttemptsCount,
    wrongAttemptsCount,
    activeWrongCount: wrongQuestions.filter((w) => !w.mastered).length,
    totalWrongRecorded: wrongQuestions.length,
    overallAccuracy,
    subjectStats,
  };
}

// Reset data to defaults
export function resetDatabase(): void {
  resetAllAppData();
}

export function clearPracticeHistory(): void {
  initializeStorage();
  setItem(KEYS.ATTEMPTS, []);
  setItem(KEYS.SESSIONS, []);
  setItem(KEYS.WRONG_QUESTIONS, []);
  localStorage.removeItem(KEYS.ACTIVE_SESSION);
}

export function resetAllAppData(): void {
  localStorage.removeItem(KEYS.SUBJECTS);
  localStorage.removeItem(KEYS.UNITS);
  localStorage.removeItem(KEYS.QUESTIONS);
  localStorage.removeItem(KEYS.WRONG_QUESTIONS);
  localStorage.removeItem(KEYS.ATTEMPTS);
  localStorage.removeItem(KEYS.SESSIONS);
  localStorage.removeItem(KEYS.ACTIVE_SESSION);
  localStorage.removeItem(KEYS.USER_PROFILE);
  initializeStorage();
}

// User Profile
const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Kishore',
  grade: '',
  school: '',
};

export function getUserProfile(): UserProfile {
  return getItem<UserProfile>(KEYS.USER_PROFILE, DEFAULT_USER_PROFILE);
}

export function saveUserProfile(profile: UserProfile): void {
  setItem(KEYS.USER_PROFILE, profile);
}

// Export / Import
export function exportDataAsJson(): string {
  initializeStorage();
  const payload = {
    app: 'OneQuest',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    profile: getUserProfile(),
    subjects: getSubjects(),
    units: getUnits(),
    questions: getQuestions(),
    wrongQuestions: getWrongQuestions(),
    attempts: getItem<Attempt[]>(KEYS.ATTEMPTS, []),
    sessions: getSessions(),
    activeSession: getActiveSession(),
    progressStats: getProgressStats(),
  };
  return JSON.stringify(payload, null, 2);
}

export interface BackupValidationResult {
  valid: boolean;
  error?: string;
  data?: any;
  summary?: {
    userName?: string;
    subjectsCount: number;
    unitsCount: number;
    questionsCount: number;
    attemptsCount: number;
    sessionsCount: number;
    wrongQuestionsCount: number;
  };
}

export function validateBackupJson(jsonStr: string): BackupValidationResult {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'The uploaded file does not contain a valid JSON object.' };
    }
    if (!Array.isArray(data.subjects) || !Array.isArray(data.units) || !Array.isArray(data.questions)) {
      return {
        valid: false,
        error: 'Backup file is missing required curriculum collections (subjects, units, or questions).',
      };
    }
    return {
      valid: true,
      data,
      summary: {
        userName: data.profile?.name || 'Student',
        subjectsCount: data.subjects.length,
        unitsCount: data.units.length,
        questionsCount: data.questions.length,
        attemptsCount: Array.isArray(data.attempts) ? data.attempts.length : 0,
        sessionsCount: Array.isArray(data.sessions) ? data.sessions.length : 0,
        wrongQuestionsCount: Array.isArray(data.wrongQuestions) ? data.wrongQuestions.length : 0,
      },
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `Malformed JSON structure: ${err?.message || 'Unable to parse file.'}`,
    };
  }
}

export function restoreBackupData(data: any): boolean {
  try {
    if (!data || !Array.isArray(data.subjects) || !Array.isArray(data.units) || !Array.isArray(data.questions)) {
      return false;
    }
    if (data.profile) {
      saveUserProfile(data.profile);
    }
    setItem(KEYS.SUBJECTS, data.subjects);
    setItem(KEYS.UNITS, data.units);
    setItem(KEYS.QUESTIONS, data.questions);
    setItem(KEYS.WRONG_QUESTIONS, Array.isArray(data.wrongQuestions) ? data.wrongQuestions : []);
    setItem(KEYS.ATTEMPTS, Array.isArray(data.attempts) ? data.attempts : []);
    setItem(KEYS.SESSIONS, Array.isArray(data.sessions) ? data.sessions : []);
    if (data.activeSession) {
      setItem(KEYS.ACTIVE_SESSION, data.activeSession);
    } else {
      localStorage.removeItem(KEYS.ACTIVE_SESSION);
    }
    return true;
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return false;
  }
}

export function importDataFromJson(jsonStr: string): boolean {
  const result = validateBackupJson(jsonStr);
  if (!result.valid || !result.data) {
    return false;
  }
  return restoreBackupData(result.data);
}

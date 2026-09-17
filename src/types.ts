export type AnswerOption = 'A' | 'B' | 'C' | 'D';

export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  unitNumber: number;
  name: string;
}

export interface Question {
  id: string;
  subjectId: string;
  unitId: string;
  questionNumber: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AnswerOption;
  explanation?: string;
  imageUrl?: string;
}

export interface WrongQuestionRecord {
  questionId: string;
  subjectId: string;
  unitId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AnswerOption;
  lastSelectedAnswer: AnswerOption;
  lastAttemptDate: string;
  wrongCount: number;
  mastered: boolean;
  imageUrl?: string;
  history: Array<{
    date: string;
    selectedAnswer: AnswerOption;
    isCorrect: boolean;
  }>;
}

export interface Attempt {
  id: string;
  sessionId: string;
  questionId: string;
  subjectId: string;
  unitId: string;
  selectedAnswer: AnswerOption;
  isCorrect: boolean;
  date: string;
}

export type PracticeMode = 'order' | 'random' | 'wrong_review';

export interface PracticeSession {
  id: string;
  subjectId: string;
  unitId?: string; // undefined if subject-level random
  mode: PracticeMode;
  title: string;
  date: string;
  questionIds: string[];
  currentIndex: number;
  answers: Record<
    string,
    {
      selected: AnswerOption;
      isCorrect: boolean;
      timestamp: string;
    }
  >;
  isCompleted: boolean;
  startTime: number;
  endTime?: number;
  score: number;
  total: number;
  accuracy: number;
}

export interface ExtractedUnit {
  id: string;
  name: string;
  questions: Omit<Question, 'id' | 'subjectId' | 'unitId'>[];
}

export interface UserProfile {
  name: string;
  grade: string;
  school: string;
}

export type ViewState =
  | { type: 'home' }
  | { type: 'subjects' }
  | { type: 'subject_detail'; subjectId: string }
  | { type: 'unit_list'; subjectId: string }
  | { type: 'practice'; sessionId: string }
  | { type: 'result'; sessionId: string }
  | { type: 'wrong_questions'; filterSubjectId?: string; filterUnitId?: string }
  | { type: 'progress' }
  | { type: 'import_pdf' }
  | { type: 'settings' };

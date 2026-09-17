import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ViewState,
  Subject,
  Unit,
  Question,
  PracticeSession,
  WrongQuestionRecord,
  PracticeMode,
  UserProfile,
} from '../types';
import * as storage from '../utils/storage';

interface AppContextType {
  viewState: ViewState;
  setViewState: (view: ViewState) => void;
  canGoBack: boolean;
  goBack: () => void;
  deleteUnfinishedPractice: (sessionId: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  subjects: Subject[];
  units: Unit[];
  activeSession: PracticeSession | null;
  wrongQuestions: WrongQuestionRecord[];
  activeWrongCount: number;
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
  refreshData: () => void;
  toast: { message: string; type?: 'info' | 'success' | 'error' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;

  // Navigation helpers
  navigateHome: () => void;
  navigateSubjects: () => void;
  navigateSubjectDetail: (subjectId: string) => void;
  navigateUnitList: (subjectId: string) => void;
  navigateWrongQuestions: (filterSubjectId?: string, filterUnitId?: string) => void;
  navigateProgress: () => void;
  navigateImportPdf: () => void;
  navigateSettings: () => void;

  // Practice session initiators
  startSubjectRandomPractice: (subjectId: string) => void;
  startUnitPractice: (subjectId: string, unitId: string, mode: 'order' | 'random') => void;
  startWrongQuestionsPractice: (filterSubjectId?: string, filterUnitId?: string) => void;
  continueActiveSession: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewState, setViewStateState] = useState<ViewState>({ type: 'home' });
  const [history, setHistory] = useState<ViewState[]>([]);
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => storage.getUserProfile());
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestionRecord[]>([]);
  const [activeSession, setActiveSessionState] = useState<PracticeSession | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('onemark_theme_mode') as 'light' | 'dark' | 'system') || 'system';
  });
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  const updateUserProfile = useCallback((profile: UserProfile) => {
    storage.saveUserProfile(profile);
    setUserProfileState(profile);
  }, []);

  // Navigate to next view while recording history
  const setViewState = useCallback((next: ViewState) => {
    setViewStateState((curr) => {
      const isSame = JSON.stringify(curr) === JSON.stringify(next);
      if (!isSame) {
        setHistory((h) => [...h, curr]);
      }
      return next;
    });
  }, []);

  const canGoBack = useMemo(() => {
    return viewState.type !== 'home';
  }, [viewState.type]);

  const goBack = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const newHistory = [...prevHistory];
        const previousState = newHistory.pop()!;
        setViewStateState(previousState);
        return newHistory;
      }

      // Logical fallback if history was empty
      setViewStateState((curr) => {
        switch (curr.type) {
          case 'unit_list':
            return { type: 'subject_detail', subjectId: curr.subjectId };
          case 'subject_detail':
            return { type: 'subjects' };
          case 'practice': {
            const sess = storage.getSession(curr.sessionId) || storage.getActiveSession();
            if (sess?.unitId) {
              return { type: 'unit_list', subjectId: sess.subjectId };
            } else if (sess?.subjectId && sess.subjectId !== 'mixed') {
              return { type: 'subject_detail', subjectId: sess.subjectId };
            }
            return { type: 'subjects' };
          }
          case 'result': {
            const sess = storage.getSession(curr.sessionId);
            if (sess?.unitId) {
              return { type: 'unit_list', subjectId: sess.subjectId };
            } else if (sess?.subjectId && sess.subjectId !== 'mixed') {
              return { type: 'subject_detail', subjectId: sess.subjectId };
            }
            return { type: 'subjects' };
          }
          case 'wrong_questions':
          case 'subjects':
          case 'progress':
          case 'import_pdf':
          case 'settings':
          default:
            return { type: 'home' };
        }
      });
      return [];
    });
  }, []);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  const refreshData = useCallback(() => {
    storage.initializeStorage();
    setSubjects(storage.getSubjects());
    setUnits(storage.getUnits());
    setWrongQuestions(storage.getWrongQuestions());
    setActiveSessionState(storage.getActiveSession());
    setUserProfileState(storage.getUserProfile());
  }, []);

  const deleteUnfinishedPractice = useCallback(
    (sessionId: string) => {
      storage.deleteSession(sessionId);
      refreshData();
      showToast('Unfinished practice deleted.', 'info');
    },
    [refreshData, showToast]
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Dark mode handling
  const [systemIsDark, setSystemIsDark] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (theme === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return theme;
  }, [theme, systemIsDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('onemark_theme_mode', theme);
  }, [resolvedTheme, theme]);

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  }, []);

  // Navigation functions
  const navigateHome = useCallback(() => {
    setViewState({ type: 'home' });
  }, []);

  const navigateSubjects = useCallback(() => {
    setViewState({ type: 'subjects' });
  }, []);

  const navigateSubjectDetail = useCallback((subjectId: string) => {
    setViewState({ type: 'subject_detail', subjectId });
  }, []);

  const navigateUnitList = useCallback((subjectId: string) => {
    setViewState({ type: 'unit_list', subjectId });
  }, []);

  const navigateWrongQuestions = useCallback((filterSubjectId?: string, filterUnitId?: string) => {
    setViewState({ type: 'wrong_questions', filterSubjectId, filterUnitId });
  }, []);

  const navigateProgress = useCallback(() => {
    setViewState({ type: 'progress' });
  }, []);

  const navigateImportPdf = useCallback(() => {
    setViewState({ type: 'import_pdf' });
  }, []);

  const navigateSettings = useCallback(() => {
    setViewState({ type: 'settings' });
  }, []);

  // Practice session initiators
  // Rule 5: When "Random" is selected directly at the Subject level, use ALL one-mark questions from ALL units of that subject and shuffle them.
  // Rule 1: Do NOT include a "Select Number of Questions" option anywhere.
  // Rule 6: Every practice session should generate a new random order when Random mode is selected.
  // Rule 7: Never repeat the same question within one practice session.
  const startSubjectRandomPractice = useCallback(
    (subjectId: string) => {
      const subject = storage.getSubject(subjectId);
      if (!subject) return;

      const allQuestions = storage.getQuestions({ subjectId });
      if (allQuestions.length === 0) {
        showToast('No questions found in this subject.', 'error');
        return;
      }

      const shuffled = shuffleArray(allQuestions);
      const questionIds = shuffled.map((q) => q.id);

      const session: PracticeSession = {
        id: 'sess_' + Date.now(),
        subjectId,
        mode: 'random',
        title: `${subject.name} - All Units (Random)`,
        date: new Date().toISOString(),
        questionIds,
        currentIndex: 0,
        answers: {},
        isCompleted: false,
        startTime: Date.now(),
        score: 0,
        total: questionIds.length,
        accuracy: 0,
      };

      storage.saveSession(session);
      setActiveSessionState(session);
      setViewState({ type: 'practice', sessionId: session.id });
    },
    [showToast]
  );

  // Rule 2: When a unit is selected, the student must practice ALL one-mark questions in that unit.
  // Rule 3: When "Order" is selected, show all questions in their original order.
  // Rule 4: When "Random" is selected for a unit, show all questions from that unit, but shuffle their order.
  const startUnitPractice = useCallback(
    (subjectId: string, unitId: string, mode: 'order' | 'random') => {
      const subject = storage.getSubject(subjectId);
      const unit = storage.getUnit(unitId);
      if (!subject || !unit) return;

      const unitQuestions = storage.getQuestions({ subjectId, unitId });
      if (unitQuestions.length === 0) {
        showToast('No questions available in this unit.', 'error');
        return;
      }

      // Order vs Random
      let orderedQuestions = [...unitQuestions];
      if (mode === 'order') {
        orderedQuestions.sort((a, b) => a.questionNumber - b.questionNumber);
      } else {
        orderedQuestions = shuffleArray(orderedQuestions);
      }

      const questionIds = orderedQuestions.map((q) => q.id);

      const session: PracticeSession = {
        id: 'sess_' + Date.now(),
        subjectId,
        unitId,
        mode,
        title: `${subject.name} - ${unit.name} (${mode === 'order' ? 'Original Order' : 'Random Order'})`,
        date: new Date().toISOString(),
        questionIds,
        currentIndex: 0,
        answers: {},
        isCompleted: false,
        startTime: Date.now(),
        score: 0,
        total: questionIds.length,
        accuracy: 0,
      };

      storage.saveSession(session);
      setActiveSessionState(session);
      setViewState({ type: 'practice', sessionId: session.id });
    },
    [showToast]
  );

  // Rule 12: Practice Wrong Questions Again
  const startWrongQuestionsPractice = useCallback(
    (filterSubjectId?: string, filterUnitId?: string) => {
      const list = storage.getWrongQuestions({ subjectId: filterSubjectId, unitId: filterUnitId });
      if (list.length === 0) {
        showToast('No wrong questions recorded to practice yet!', 'info');
        return;
      }

      // Extract question IDs from saved wrong questions
      const questionIds = list.map((wq) => wq.questionId);

      const title = filterSubjectId
        ? `Wrong Questions Practice (${storage.getSubject(filterSubjectId)?.name || 'Filtered'})`
        : 'All Wrong Questions Practice';

      const session: PracticeSession = {
        id: 'sess_wrong_' + Date.now(),
        subjectId: filterSubjectId || 'mixed',
        unitId: filterUnitId,
        mode: 'wrong_review',
        title,
        date: new Date().toISOString(),
        questionIds,
        currentIndex: 0,
        answers: {},
        isCompleted: false,
        startTime: Date.now(),
        score: 0,
        total: questionIds.length,
        accuracy: 0,
      };

      storage.saveSession(session);
      setActiveSessionState(session);
      setViewState({ type: 'practice', sessionId: session.id });
    },
    [showToast]
  );

  const continueActiveSession = useCallback(() => {
    const session = storage.getActiveSession();
    if (session && !session.isCompleted) {
      setViewState({ type: 'practice', sessionId: session.id });
    } else {
      showToast('No active unfinished session found.', 'info');
    }
  }, [showToast]);

  const activeWrongCount = useMemo(() => {
    return wrongQuestions.filter((w) => !w.mastered).length;
  }, [wrongQuestions]);

  return (
    <AppContext.Provider
      value={{
        viewState,
        setViewState,
        canGoBack,
        goBack,
        deleteUnfinishedPractice,
        userProfile,
        updateUserProfile,
        subjects,
        units,
        activeSession,
        wrongQuestions,
        activeWrongCount,
        theme,
        setTheme,
        resolvedTheme,
        refreshData,
        toast,
        showToast,
        navigateHome,
        navigateSubjects,
        navigateSubjectDetail,
        navigateUnitList,
        navigateWrongQuestions,
        navigateProgress,
        navigateImportPdf,
        navigateSettings,
        startSubjectRandomPractice,
        startUnitPractice,
        startWrongQuestionsPractice,
        continueActiveSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

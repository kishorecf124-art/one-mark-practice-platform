import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { HomeView } from './components/HomeView';
import { SubjectsListView } from './components/SubjectsListView';
import { SubjectView } from './components/SubjectView';
import { UnitListView } from './components/UnitListView';
import { PracticeView } from './components/PracticeView';
import { ResultView } from './components/ResultView';
import { WrongQuestionsView } from './components/WrongQuestionsView';
import { ProgressView } from './components/ProgressView';
import { ImportPdfView } from './components/ImportPdfView';
import { SettingsView } from './components/SettingsView';
import { GalaxyBackground } from './components/GalaxyBackground';
import {
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { viewState, toast, canGoBack, goBack } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [creatorPopupOpen, setCreatorPopupOpen] = useState(false);
  const creatorRef = useRef<HTMLDivElement>(null);

  // Auto-close mobile drawer when view changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [viewState]);

  // Close creator popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (creatorRef.current && !creatorRef.current.contains(event.target as Node)) {
        setCreatorPopupOpen(false);
      }
    };
    if (creatorPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [creatorPopupOpen]);

  // Unique view key for smooth page transitions
  const getViewKey = () => {
    switch (viewState.type) {
      case 'subject_detail':
        return `subject_${viewState.subjectId}`;
      case 'unit_list':
        return `unit_list_${viewState.subjectId}`;
      case 'practice':
        return `practice_${viewState.sessionId}`;
      case 'result':
        return `result_${viewState.sessionId}`;
      case 'wrong_questions':
        return `wrong_${viewState.subjectId || 'all'}_${viewState.unitId || 'all'}`;
      default:
        return viewState.type;
    }
  };

  // Render active view based on state
  const renderCurrentView = () => {
    switch (viewState.type) {
      case 'home':
        return <HomeView />;
      case 'subjects':
        return <SubjectsListView />;
      case 'subject_detail':
        return <SubjectView subjectId={viewState.subjectId} />;
      case 'unit_list':
        return <UnitListView subjectId={viewState.subjectId} />;
      case 'practice':
        return <PracticeView sessionId={viewState.sessionId} />;
      case 'result':
        return <ResultView sessionId={viewState.sessionId} />;
      case 'wrong_questions':
        return (
          <WrongQuestionsView
            filterSubjectId={viewState.subjectId}
            filterUnitId={viewState.unitId}
          />
        );
      case 'progress':
        return <ProgressView />;
      case 'import_pdf':
        return <ImportPdfView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#030614] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 relative">
      {/* Deep Space Milky Way Galaxy Backdrop (Rendered behind interface in Dark Mode) */}
      <GalaxyBackground />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 h-full flex flex-col">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Consistent Top-Left Back Button for Sub-pages */}
            {canGoBack && (
              <button
                id="header_global_back_btn"
                onClick={goBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold shadow-2xs hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shrink-0 group"
                title="Back to previous screen"
                aria-label="Back to previous screen"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Dynamic Breadcrumbs */}
            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Creator Information Box */}
            <div className="relative" ref={creatorRef}>
              <button
                id="btn_creator_info"
                onClick={() => setCreatorPopupOpen((prev) => !prev)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  creatorPopupOpen
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Creator Information"
                aria-label="Creator Information"
              >
                <Info className="w-4 h-4" />
              </button>

              {creatorPopupOpen && (
                <div
                  id="creator_info_card"
                  className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/50 p-4 z-50 animate-fadeIn select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      The Creator
                    </span>
                    <button
                      onClick={() => setCreatorPopupOpen(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="py-2 text-center space-y-1">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
                      Kishore . K
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      One-Mark Practice Platform
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable View Container with Smooth Transition Animations */}
        <main
          id="main_view_container"
          className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none relative"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={getViewKey()}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="min-h-full"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Floating Toast Alert */}
      {toast && (
        <div
          id="app_global_toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border animate-bounceIn transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
        >
          {toast.type === 'success' && (
            <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="p-1 rounded-lg bg-rose-100 dark:bg-rose-950">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            </div>
          )}
          <span className="text-xs sm:text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

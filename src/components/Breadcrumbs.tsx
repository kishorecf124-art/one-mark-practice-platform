import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';

interface Crumb {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const Breadcrumbs: React.FC = () => {
  const {
    viewState,
    navigateHome,
    navigateSubjects,
    navigateSubjectDetail,
    navigateUnitList,
    activeSession,
  } = useApp();

  const renderCrumbs = (): Crumb[] => {
    switch (viewState.type) {
      case 'home':
        return [
          { label: 'Home', active: true, onClick: navigateHome },
        ];

      case 'subjects':
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Subjects', active: true, onClick: navigateSubjects },
        ];

      case 'subject_detail': {
        const subj = storage.getSubject(viewState.subjectId);
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Subjects', onClick: navigateSubjects },
          { label: subj?.name || 'Subject', active: true, onClick: () => navigateSubjectDetail(viewState.subjectId) },
        ];
      }

      case 'unit_list': {
        const subj = storage.getSubject(viewState.subjectId);
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Subjects', onClick: navigateSubjects },
          { label: subj?.name || 'Subject', onClick: () => navigateSubjectDetail(viewState.subjectId) },
          { label: 'Unit Wise', active: true },
        ];
      }

      case 'practice': {
        const session = storage.getSession(viewState.sessionId) || activeSession;
        if (!session) {
          return [{ label: 'Home', onClick: navigateHome }, { label: 'Practice', active: true }];
        }
        const subj = storage.getSubject(session.subjectId);
        const unit = session.unitId ? storage.getUnit(session.unitId) : null;

        const crumbs: Crumb[] = [
          { label: 'Home', onClick: navigateHome },
          { label: subj?.name || 'Subjects', onClick: () => subj ? navigateSubjectDetail(subj.id) : navigateSubjects() },
        ];

        if (unit) {
          crumbs.push({
            label: unit.name.split(':')[0].trim(),
            onClick: () => subj ? navigateUnitList(subj.id) : undefined,
          });
          crumbs.push({
            label: session.mode === 'order' ? 'Order Practice' : 'Random Practice',
            active: true,
          });
        } else if (session.mode === 'wrong_review') {
          crumbs.push({ label: 'Wrong Questions Practice', active: true });
        } else {
          crumbs.push({ label: 'All Units (Random)', active: true });
        }

        return crumbs;
      }

      case 'result': {
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Practice Result', active: true },
        ];
      }

      case 'wrong_questions':
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Wrong Questions', active: true },
        ];

      case 'progress':
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Progress & Analytics', active: true },
        ];

      case 'import_pdf':
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Import Question PDF', active: true },
        ];

      case 'settings':
        return [
          { label: 'Home', onClick: navigateHome },
          { label: 'Settings', active: true },
        ];

      default:
        return [{ label: 'Home', active: true, onClick: navigateHome }];
    }
  };

  const crumbs = renderCrumbs();

  return (
    <nav
      id="app_breadcrumbs"
      aria-label="Breadcrumbs"
      className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs font-medium text-slate-500 dark:text-slate-400 select-none"
    >
      <button
        onClick={navigateHome}
        className="hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        title="Go to Home"
      >
        <Home className="w-3.5 h-3.5" />
      </button>
      {crumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
          {crumb.active || !crumb.onClick ? (
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">
              {crumb.label}
            </span>
          ) : (
            <button
              onClick={crumb.onClick}
              className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors truncate max-w-[120px] sm:max-w-[180px] cursor-pointer"
            >
              {crumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

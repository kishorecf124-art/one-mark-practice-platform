import React from 'react';
import {
  Home,
  BookOpen,
  XCircle,
  BarChart3,
  FileDown,
  Settings,
  Sun,
  Moon,
  WifiOff,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const {
    viewState,
    navigateHome,
    navigateSubjects,
    navigateWrongQuestions,
    navigateProgress,
    navigateImportPdf,
    navigateSettings,
    activeWrongCount,
    setTheme,
    resolvedTheme,
  } = useApp();

  const handleNav = (action: () => void) => {
    action();
    if (onNavigate) {
      onNavigate();
    }
  };

  const isCurrent = (type: string) => {
    if (type === 'home' && viewState.type === 'home') return true;
    if (type === 'subjects' && (viewState.type === 'subjects' || viewState.type === 'subject_detail' || viewState.type === 'unit_list')) return true;
    if (type === 'wrong' && viewState.type === 'wrong_questions') return true;
    if (type === 'progress' && viewState.type === 'progress') return true;
    if (type === 'import' && viewState.type === 'import_pdf') return true;
    if (type === 'settings' && viewState.type === 'settings') return true;
    return false;
  };

  const navItems = [
    { id: 'nav_home', label: 'Home', icon: Home, active: isCurrent('home'), onClick: () => handleNav(navigateHome) },
    { id: 'nav_subjects', label: 'Subjects', icon: BookOpen, active: isCurrent('subjects'), onClick: () => handleNav(navigateSubjects) },
    {
      id: 'nav_wrong',
      label: 'Wrong Questions',
      icon: XCircle,
      active: isCurrent('wrong'),
      onClick: () => handleNav(navigateWrongQuestions),
      badge: activeWrongCount > 0 ? activeWrongCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'nav_progress', label: 'Progress', icon: BarChart3, active: isCurrent('progress'), onClick: () => handleNav(navigateProgress) },
    { id: 'nav_import', label: 'Import PDF', icon: FileDown, active: isCurrent('import'), onClick: () => handleNav(navigateImportPdf) },
    { id: 'nav_settings', label: 'Settings', icon: Settings, active: isCurrent('settings'), onClick: () => handleNav(navigateSettings) },
  ];

  return (
    <aside
      id="main_sidebar"
      className="w-64 flex-shrink-0 flex flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200 select-none z-20"
    >
      {/* App Branding */}
      <div>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => handleNav(navigateHome)}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none flex-1 min-w-0"
            id="brand_home_button"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <span className="text-xl tracking-tighter font-extrabold">1Q</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none truncate">
                  OneQuest
                </h1>
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
                  Desk
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Offline One-Mark Practice
              </p>
            </div>
          </button>
          {onNavigate && (
            <button
              onClick={onNavigate}
              className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Close navigation drawer"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  item.active
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-150 ${
                      item.active ? 'scale-110 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${
                      item.active ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-indigo-950' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Quick Theme Toggle */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        {/* Quick Theme Toggle */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">Theme Mode</span>
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              id="theme_light_toggle"
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                resolvedTheme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            </button>
            <button
              id="theme_dark_toggle"
              onClick={() => setTheme('dark')}
              title="Dark Mode (Night Study)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                resolvedTheme === 'dark'
                  ? 'bg-slate-700 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

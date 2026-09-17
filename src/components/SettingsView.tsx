import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  RotateCcw,
  WifiOff,
  ShieldCheck,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  User,
  GraduationCap,
  School,
  Edit3,
  Check,
  X,
  History,
  Trash2,
  FileJson,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';
import { UserProfile } from '../types';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, userProfile, updateUserProfile, refreshData, showToast } = useApp();

  // Student Profile Edit State
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name || '');
  const [gradeInput, setGradeInput] = useState(userProfile.grade || '');
  const [schoolInput, setSchoolInput] = useState(userProfile.school || '');

  // Data & Storage: Restore State
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<any | null>(null);
  const [pendingRestoreSummary, setPendingRestoreSummary] = useState<storage.BackupValidationResult['summary'] | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Data & Storage: Clear History State
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  // Data & Storage: Reset App Data State
  const [showResetDataConfirm, setShowResetDataConfirm] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState('');

  // Handle Save Student Details
  const handleSaveDetails = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: UserProfile = {
      name: nameInput.trim() || 'Student',
      grade: gradeInput.trim(),
      school: schoolInput.trim(),
    };
    updateUserProfile(updated);
    setIsEditingDetails(false);
    showToast('Your details have been updated successfully!', 'success');
  };

  const handleStartEditDetails = () => {
    setNameInput(userProfile.name || '');
    setGradeInput(userProfile.grade || '');
    setSchoolInput(userProfile.school || '');
    setIsEditingDetails(true);
  };

  const handleCancelEditDetails = () => {
    setNameInput(userProfile.name || '');
    setGradeInput(userProfile.grade || '');
    setSchoolInput(userProfile.school || '');
    setIsEditingDetails(false);
  };

  // Option 1: Export Backup
  const handleExportBackup = () => {
    try {
      const dataStr = storage.exportDataAsJson();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `onequest_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Backup file exported successfully!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export backup file.', 'error');
    }
  };

  // Option 2: Restore Backup (Select & Validate)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        showToast('Empty backup file provided.', 'error');
        return;
      }

      const validation = storage.validateBackupJson(content);
      if (!validation.valid || !validation.data) {
        showToast(validation.error || 'Invalid or corrupted backup file.', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Valid backup file parsed -> open confirmation dialog
      setPendingRestoreData(validation.data);
      setPendingRestoreSummary(validation.summary || null);
      setShowRestoreConfirm(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      showToast('Failed to read the selected backup file.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!pendingRestoreData) return;
    const success = storage.restoreBackupData(pendingRestoreData);
    if (success) {
      refreshData();
      setShowRestoreConfirm(false);
      setPendingRestoreData(null);
      setPendingRestoreSummary(null);
      showToast('Backup restored successfully! All data and progress have been refreshed.', 'success');
    } else {
      showToast('Failed to restore backup data.', 'error');
    }
  };

  // Option 3: Clear History
  const handleConfirmClearHistory = () => {
    storage.clearPracticeHistory();
    refreshData();
    setShowClearHistoryConfirm(false);
    showToast('All practice history and performance metrics cleared.', 'info');
  };

  // Option 4: Reset App Data
  const handleConfirmResetData = () => {
    if (resetConfirmationText.trim().toUpperCase() !== 'RESET') {
      return;
    }
    storage.resetAllAppData();
    refreshData();
    setShowResetDataConfirm(false);
    setResetConfirmationText('');
    showToast('All application data has been permanently reset to defaults.', 'info');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            <SettingsIcon className="w-5 h-5" />
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your study environment, manage student details, and control offline backups and data.
        </p>
      </div>

      {/* 1. Student Details / User Profile */}
      <div
        id="settings_user_details_card"
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                User Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalized student profile information for practice sessions and reports.
              </p>
            </div>
          </div>

          {!isEditingDetails ? (
            <button
              id="settings_edit_profile_btn"
              onClick={handleStartEditDetails}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Details</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEditDetails}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDetails}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Details Form or Readout */}
        {isEditingDetails ? (
          <form onSubmit={handleSaveDetails} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Student Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Kishore"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Class / Grade
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    placeholder="e.g. 12th Standard, Class 10"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  School / Institution
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolInput}
                    onChange={(e) => setSchoolInput(e.target.value)}
                    placeholder="e.g. City Higher Secondary School"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Student Name
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {userProfile.name || '—'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Class / Grade
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {userProfile.grade || '—'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                School / Institution
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
                {userProfile.school || '—'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Theme Settings (Dark mode for late night study sessions) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Appearance & Night Study Mode
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between light, dark, or system mode to reduce eye strain during late night study sessions.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs">Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="text-xs">Dark (Night)</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'system'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-500" />
            <span className="text-xs">System</span>
          </button>
        </div>
      </div>

      {/* 3. 💾 Data & Storage Card */}
      <div
        id="settings_data_storage_card"
        className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6"
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>💾 Data & Storage</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Export offline backups, restore question banks, clear practice analytics, or reset local app data.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
            Local Offline
          </span>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Export Backup */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Download className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Export Backup
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Download all your local data including student profile, subjects, units, question banks, practice history, wrong questions, accuracy metrics, and unfinished sessions into a JSON backup file.
              </p>
            </div>

            <button
              id="btn_export_backup"
              onClick={handleExportBackup}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup</span>
            </button>
          </div>

          {/* Option 2: Restore Backup */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Restore Backup
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Select a previously exported JSON backup file. The backup is safely validated first, and a confirmation summary is shown before replacing existing questions and practice progress.
              </p>
            </div>

            <div>
              <label
                htmlFor="btn_restore_backup_input"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Restore Backup</span>
              </label>
              <input
                ref={fileInputRef}
                id="btn_restore_backup_input"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Option 3: Clear History */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <History className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  3. Clear History
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Clear all question attempt logs, practice sessions, accuracy metrics, and wrong question records. This preserves all your subjects, units, and imported question banks.
              </p>
            </div>

            <button
              id="btn_clear_history"
              onClick={() => setShowClearHistoryConfirm(true)}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs transition-all cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>

          {/* Option 4: Reset App Data */}
          <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                  4. Reset App Data
                </h4>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300/90 mt-2 leading-relaxed">
                Permanently wipe all locally stored data including student profile details, all subjects, units, questions, wrong questions, and practice sessions, restoring the clean original state.
              </p>
            </div>

            <button
              id="btn_reset_app_data"
              onClick={() => {
                setResetConfirmationText('');
                setShowResetDataConfirm(true);
              }}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset App Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Offline Storage Architecture Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                100% Offline-First Architecture
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              OneQuest does not require an active internet connection, external servers, or cloud storage. All questions, wrong question notes, and user records remain safely stored on your local machine.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero Data Telemetry</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <HardDrive className="w-4 h-4 text-indigo-500" />
            <span>Local Disk Persistence</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant Response Times</span>
          </div>
        </div>
      </div>

      {/* MODAL 1: Restore Backup Confirmation Modal */}
      {showRestoreConfirm && pendingRestoreSummary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setShowRestoreConfirm(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600">
                <FileJson className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Restore Backup Data?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Validated OneQuest backup package
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Restoring this backup will replace current question banks, custom subjects, and practice history with the contents below.
              </p>

              {/* Summary Stats */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Student Profile:</span>
                  <span className="font-bold">{pendingRestoreSummary.userName || 'Student'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Subjects Included:</span>
                  <span className="font-bold">{pendingRestoreSummary.subjectsCount} subjects</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Units Included:</span>
                  <span className="font-bold">{pendingRestoreSummary.unitsCount} units</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Total Questions:</span>
                  <span className="font-bold">{pendingRestoreSummary.questionsCount} questions</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Practice History:</span>
                  <span className="font-bold">
                    {pendingRestoreSummary.attemptsCount} attempts / {pendingRestoreSummary.sessionsCount} sessions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowRestoreConfirm(false);
                  setPendingRestoreData(null);
                  setPendingRestoreSummary(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn_confirm_restore_backup"
                type="button"
                onClick={handleConfirmRestore}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Restore Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Clear History Confirmation Modal */}
      {showClearHistoryConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setShowClearHistoryConfirm(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-4 shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600">
                <History className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Clear all practice history?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Performance & attempt records reset
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will clear all your question attempts, active practice sessions, wrong questions log, and accuracy metrics.
            </p>
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
              ✓ Your subjects, units, and custom imported question banks will NOT be deleted.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearHistoryConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn_confirm_clear_history"
                type="button"
                onClick={handleConfirmClearHistory}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Reset App Data Strong Confirmation Modal */}
      {showResetDataConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setShowResetDataConfirm(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-4 shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-rose-100 dark:border-rose-900/60">
              <span className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Reset App Data
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will permanently delete all locally stored data:
            </p>

            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pl-4 list-disc">
              <li>Student profile details</li>
              <li>Custom subjects and units</li>
              <li>All questions and answers (including imported banks)</li>
              <li>Wrong questions and practice history</li>
              <li>Active and unfinished practice sessions</li>
            </ul>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Type <span className="text-rose-600 dark:text-rose-400 font-mono">RESET</span> below to confirm:
              </label>
              <input
                id="input_reset_confirmation"
                type="text"
                value={resetConfirmationText}
                onChange={(e) => setResetConfirmationText(e.target.value)}
                placeholder="Type RESET"
                className="w-full px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowResetDataConfirm(false);
                  setResetConfirmationText('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn_confirm_reset_all_data"
                type="button"
                disabled={resetConfirmationText.trim().toUpperCase() !== 'RESET'}
                onClick={handleConfirmResetData}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  BookOpen,
  Atom,
  FlaskConical,
  Calculator,
  Laptop,
  Brain,
  Globe,
  Compass,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Trash2,
  CheckCircle2,
  FileUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as storage from '../utils/storage';
import { SubjectPdfUploadModal } from './SubjectPdfUploadModal';

const AVAILABLE_ICONS = [
  { id: 'BookOpen', label: 'Book / Literature', Icon: BookOpen },
  { id: 'Atom', label: 'Physics / Science', Icon: Atom },
  { id: 'FlaskConical', label: 'Chemistry', Icon: FlaskConical },
  { id: 'Calculator', label: 'Mathematics', Icon: Calculator },
  { id: 'Laptop', label: 'Computer Science', Icon: Laptop },
  { id: 'Brain', label: 'Psychology / Logic', Icon: Brain },
  { id: 'Globe', label: 'Social / Geography', Icon: Globe },
  { id: 'Compass', label: 'Engineering / Design', Icon: Compass },
  { id: 'GraduationCap', label: 'General Academy', Icon: GraduationCap },
];

export const SubjectsListView: React.FC = () => {
  const { navigateSubjectDetail, refreshData, showToast, goBack } = useApp();
  const stats = storage.getProgressStats();

  // Add Subject Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadModalSubjectId, setUploadModalSubjectId] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('BookOpen');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newSubjectName.trim();
    if (!trimmedName) {
      showToast('Please enter a subject name.', 'error');
      return;
    }

    const created = storage.addSubject({
      name: trimmedName,
      description: newSubjectDesc.trim() || 'One-mark objective practice questions.',
      icon: selectedIcon,
    });

    // Default initial unit
    storage.addUnit(created.id, 'Unit 1: Overview');

    refreshData();
    showToast(`Subject "${trimmedName}" created successfully!`, 'success');
    setShowAddModal(false);
    setNewSubjectName('');
    setNewSubjectDesc('');
  };

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    storage.deleteSubject(subjectId);
    refreshData();
    setDeleteConfirmId(null);
    showToast(`Subject "${subjectName}" deleted.`, 'info');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="p-2 mt-0.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Back to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Subjects
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore all curriculum subjects or add new subjects to organize one-mark question banks.
            </p>
          </div>
        </div>

        {/* Add New Subject Button */}
        <button
          id="btn_open_add_subject"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer hover:scale-[1.02] flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.subjectStats.map(({ subject, totalQuestions, accuracy }) => {
          return (
            <div
              key={subject.id}
              id={`subject_overview_${subject.id}`}
              className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {renderSubjectIcon(subject.icon)}
                  </div>

                  {/* Delete Option for All Subjects */}
                  <div>
                    {deleteConfirmId === subject.id ? (
                      <div className="flex items-center gap-1.5 p-1 bg-rose-50 dark:bg-rose-950/60 rounded-xl border border-rose-200 dark:border-rose-800">
                        <button
                          onClick={() => handleDeleteSubject(subject.id, subject.name)}
                          className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(subject.id)}
                        title="Delete Subject"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {subject.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {subject.description || 'One-mark objective practice questions.'}
                </p>

                <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Questions:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {totalQuestions}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Accuracy:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {accuracy > 0 ? `${accuracy}%` : '0%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  id={`btn_upload_${subject.id}`}
                  onClick={() => setUploadModalSubjectId(subject.id)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer"
                  title="Upload PDF Question Bank"
                >
                  <FileUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Upload PDF</span>
                </button>

                <button
                  id={`btn_practice_${subject.id}`}
                  onClick={() => navigateSubjectDetail(subject.id)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload PDF Modal */}
      {uploadModalSubjectId && (
        <SubjectPdfUploadModal
          subjectId={uploadModalSubjectId}
          isOpen={true}
          onClose={() => {
            setUploadModalSubjectId(null);
            refreshData();
          }}
        />
      )}

      {/* Add New Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400">
                  <Plus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Create New Subject
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the subject details to add it to your practice list.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biology, Computer Science, Economics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Optional Subject Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class 12 Board Exam One-Mark Questions"
                  value={newSubjectDesc}
                  onChange={(e) => setNewSubjectDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Icon
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                  {AVAILABLE_ICONS.map(({ id, label, Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSelectedIcon(id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        selectedIcon === id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-500 font-bold'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs truncate">{label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

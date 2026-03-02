import { List, Grid3x3, Table, Calendar, Rows } from 'lucide-react';
import type { ViewMode } from '../../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  const views: { value: ViewMode; icon: typeof List; label: string; description: string }[] = [
    { value: 'list', icon: List, label: 'List', description: 'Simple list view' },
    { value: 'board', icon: Grid3x3, label: 'Board', description: 'Kanban board view' },
    { value: 'table', icon: Table, label: 'Table', description: 'Sortable table view' },
    { value: 'timeline', icon: Calendar, label: 'Timeline', description: 'Timeline view' },
    { value: 'compact', icon: Rows, label: 'Compact', description: 'Compact list view' },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {views.map(({ value, icon: Icon, label, description }) => (
        <button
          key={value}
          onClick={() => onViewModeChange(value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault();
              const currentIndex = views.findIndex(v => v.value === viewMode);
              let nextIndex;
              if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : views.length - 1;
              } else {
                nextIndex = currentIndex < views.length - 1 ? currentIndex + 1 : 0;
              }
              onViewModeChange(views[nextIndex].value);
              (e.currentTarget.parentElement?.children[nextIndex] as HTMLElement)?.focus();
            }
          }}
          className={`p-2 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            viewMode === value
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm scale-105'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title={`${label}: ${description}`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}


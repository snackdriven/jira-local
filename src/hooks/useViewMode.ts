import { useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from '../lib/storage';
import type { ViewMode } from '../types';

export function useViewMode(filterId?: string) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    const data = loadData();
    // Get view mode for specific filter, or default
    if (filterId) {
      // Could store per-filter preferences in future
      const defaultMode = data.settings.defaultViewMode || 'list';
      setViewMode(defaultMode);
    } else {
      setViewMode(data.settings.defaultViewMode || 'list');
    }
  }, [filterId]);

  const updateViewMode = useCallback((newMode: ViewMode) => {
    setViewMode(newMode);
    
    const data = loadData();
    data.settings.defaultViewMode = newMode;
    saveData(data);
  }, []);

  return {
    viewMode,
    setViewMode: updateViewMode,
  };
}


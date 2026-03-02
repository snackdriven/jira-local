import { useState, useEffect } from 'react';
import { loadData, saveData } from '../lib/storage';

export type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const data = loadData();
    const savedTheme = data.settings.theme || 'auto';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let actualTheme: 'light' | 'dark';
    if (newTheme === 'auto') {
      actualTheme = prefersDark ? 'dark' : 'light';
    } else {
      actualTheme = newTheme;
    }

    setResolvedTheme(actualTheme);
    
    root.classList.add('theme-transition');
    
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  };

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    const data = loadData();
    data.settings.theme = newTheme;
    saveData(data);
  };

  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('auto');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
  };
}


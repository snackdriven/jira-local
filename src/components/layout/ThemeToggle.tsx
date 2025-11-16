import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const themes: { value: Theme; icon: typeof Sun; label: string; description: string }[] = [
    { value: 'light', icon: Sun, label: 'Light', description: 'Light theme' },
    { value: 'dark', icon: Moon, label: 'Dark', description: 'Dark theme' },
    { value: 'auto', icon: Monitor, label: 'Auto', description: 'Follow system preference' },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent, value: Theme) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onThemeChange(value);
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        title={`Theme: ${currentTheme.label}`}
      >
        <CurrentIcon className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
        >
          {themes.map(({ value, icon: Icon, label, description }) => (
            <button
              key={value}
              onClick={() => {
                onThemeChange(value);
                setIsOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                theme === value
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
              </div>
              {theme === value && (
                <span className="text-primary-600 dark:text-primary-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


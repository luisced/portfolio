'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 flex size-10 items-center justify-center rounded-full glass hover:glass-strong transition-all duration-200 lg:flex hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="size-5 text-foreground" />
      ) : (
        <Sun className="size-5 text-foreground" />
      )}
    </button>
  );
}

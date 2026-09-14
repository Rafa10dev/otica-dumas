'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: 'light', setTheme: () => undefined });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  useEffect(() => {
    const stored = window.localStorage.getItem('otica-dumas-theme');
    const next: Theme = stored === 'dark' ? 'dark' : 'light';
    setThemeState(next);
    document.documentElement.dataset.theme = next;
  }, []);
  function setTheme(next: Theme) {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('otica-dumas-theme', next);
  }
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  return <button className="icon-button theme-toggle" type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'} title={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}

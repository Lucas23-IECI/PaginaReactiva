'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to light if no stored preference (per user request: "no lo quiero con este dark mode")
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      // Default fallback is light
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? (
        <Moon size={16} className="transition-transform duration-300 rotate-0 hover:-rotate-12" />
      ) : (
        <Sun size={16} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
      )}
    </button>
  );
}

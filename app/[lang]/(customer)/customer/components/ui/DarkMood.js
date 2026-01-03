"use client";

import { SunIcon } from "lucide-react";
import { MoonIcon } from "lucide-react";
import { Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function DarkModeToggle({ isCollapsed=false }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prevIsDark) => {
      const newIsDark = !prevIsDark;
      if (newIsDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newIsDark;
    });
  }, []);

  return (
   <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className={`
        relative inline-flex items-center h-8 w-14
        border-2 border-gray-300 dark:border-gray-600
        ${isDark ? 'bg-gray-800 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600'}
        transition-colors ease-in-out duration-200
      `}
    >
      <span className="sr-only">{isDark ? 'Dark mode' : 'Light mode'}</span>
      <span
        className={`
          ${isDark ? 'translate-x-6 ' : 'translate-x-0'}
          pointer-events-none flex items-center justify-center h-7 w-7 transform 
          bg-white dark:bg-gray-400 shadow-lg border dark:border-gray-500 border-gray-300
          transition ease-in-out duration-200
        `}
      >{isDark ? <SunIcon  className="w-4 h-4 text-white"/> : <MoonIcon className="w-4 h-4 text-yellow-400"/>}</span>
    </button>
  );
}


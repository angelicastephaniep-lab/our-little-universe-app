import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'purple' | 'green';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isGreen: boolean;
  isPurple: boolean;
}

const STORAGE_KEY_THEME = 'our_little_universe_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return saved === 'green' ? 'green' : 'purple';
    } catch {
      return 'purple';
    }
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    } catch {
      // safe
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'purple' ? 'green' : 'purple');
  };

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'green') {
        document.body.classList.add('theme-green');
        document.body.classList.remove('theme-purple');
      } else {
        document.body.classList.add('theme-purple');
        document.body.classList.remove('theme-green');
      }
    } catch {
      // safe
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isGreen: theme === 'green',
        isPurple: theme === 'purple',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

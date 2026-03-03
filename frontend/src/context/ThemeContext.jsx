import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { } });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check if user has explicitly set a theme preference using the toggle
        const userHasChosen = localStorage.getItem('dropPayThemeSet') === 'true';
        if (!userHasChosen) {
            // Reset to dark for all users who got 'light' from the old default
            localStorage.setItem('dropPayTheme', 'dark');
            return 'dark';
        }
        return localStorage.getItem('dropPayTheme') || 'dark';
    });

    // Apply class to <html> on mount and on every change
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
        localStorage.setItem('dropPayTheme', theme);

        // Notify the rest of the app (Home.jsx, etc.)
        window.dispatchEvent(
            new CustomEvent('dp-theme-change', { detail: { mode: theme } })
        );
    }, [theme]);

    const toggleTheme = useCallback(() => {
        localStorage.setItem('dropPayThemeSet', 'true'); // user explicitly chose
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;

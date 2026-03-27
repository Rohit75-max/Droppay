import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { } });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Derive mode from the stored nexus theme (handles aero-light, kawaii, etc.)
        const lightNexusThemes = ['aero-light', 'alabaster-pulse', 'kawaii', 'live_kawaii'];
        const storedNexus = localStorage.getItem('nexusTheme');
        if (storedNexus && lightNexusThemes.includes(storedNexus)) {
            return 'light';
        }
        // Fall back to explicitly stored dp theme
        return localStorage.getItem('dropeTheme') || 'dark';
    });

    // Apply class to <html> on mount and on every change
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
        localStorage.setItem('dropeTheme', theme);

        // Notify the rest of the app (Home.jsx, etc.)
        window.dispatchEvent(
            new CustomEvent('dp-theme-change', { detail: { mode: theme } })
        );
    }, [theme]);

    // Sync with nexus theme changes (e.g. when user picks aero-light/kawaii)
    useEffect(() => {
        const handleNexusChange = (e) => {
            const newMode = e.detail?.mode;
            if (newMode && (newMode === 'light' || newMode === 'dark')) {
                setTheme(newMode);
            }
        };
        window.addEventListener('nexus-theme-change', handleNexusChange);
        return () => window.removeEventListener('nexus-theme-change', handleNexusChange);
    }, []);

    const toggleTheme = useCallback(() => {
        localStorage.setItem('dropeThemeSet', 'true'); // user explicitly chose
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;

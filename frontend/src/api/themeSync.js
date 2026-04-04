/**
 * Centralized Theme Synchronization Utility
 * Standardizes theme persistence across Dashboard, Login, and Global App State.
 */

export const syncTheme = (userData) => {
    if (!userData) return;

    const newTheme = userData.nexusTheme || 'void';
    const isExplicitlySet = localStorage.getItem('dropeThemeSet') === 'true';
    const storedMode = localStorage.getItem('dropeTheme');

    // Logic to determine if the Nexus theme is Light-based or Dark-based (Recommendation)
    const lightThemes = ['aero-light', 'alabaster-pulse', 'kawaii', 'live_kawaii'];
    const recommendedMode = lightThemes.includes(newTheme) ? 'light' : 'dark';

    // SOURCE OF TRUTH: 
    // 1. If explicit explicitly toggled on this browser (localStorage)
    // 2. Else use the DB's true state (userData.nexusThemeMode)
    // 3. Fallback to recommended
    let newMode = recommendedMode;
    if (isExplicitlySet && storedMode) {
        newMode = storedMode;
    } else if (userData.nexusThemeMode) {
        newMode = userData.nexusThemeMode;
    }

    // 1. Persist to Local Storage
    localStorage.setItem('nexusTheme', newTheme);
    if (!isExplicitlySet) {
        localStorage.setItem('dropeTheme', newMode);
    }

    // 2. Update Global Document Classes
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark', 'light');
    root.classList.add(newMode);

    const classesToRemove = Array.from(body.classList).filter(c => c.startsWith('theme-'));
    classesToRemove.forEach(c => body.classList.remove(c));
    body.classList.add(`theme-${newTheme}`);

    // 3. Dispatch Global Event
    window.dispatchEvent(
        new CustomEvent('nexus-theme-change', {
            detail: { theme: newTheme, mode: newMode }
        })
    );

    return { theme: newTheme, mode: newMode };
};

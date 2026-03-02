/**
 * Centralized Theme Synchronization Utility
 * Standardizes theme persistence across Dashboard, Login, and Global App State.
 */

export const syncTheme = (userData) => {
    if (!userData) return;

    const newTheme = userData.nexusTheme || 'void';

    // Logic to determine if the Nexus theme is Light-based or Dark-based
    const lightThemes = ['aero-light', 'alabaster-pulse', 'kawaii', 'live_kawaii'];
    const newMode = lightThemes.includes(newTheme) ? 'light' : 'dark';

    // 1. Persist to Local Storage (Immediate frontend recovery)
    localStorage.setItem('nexusTheme', newTheme);
    localStorage.setItem('dropPayTheme', newMode);

    // 2. Update Global Document Classes (Visual application)
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newMode);

    // 3. Dispatch Global Event (Notify App.js and other listeners)
    window.dispatchEvent(
        new CustomEvent('nexus-theme-change', {
            detail: { theme: newTheme, mode: newMode }
        })
    );

    console.log(`[ThemeSync] Synchronized: ${newTheme} (${newMode})`);
    return { theme: newTheme, mode: newMode };
};

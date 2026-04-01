import React, { createContext, useContext, useState, useCallback } from 'react';

const HUDContext = createContext();

export const HUDProvider = ({ children }) => {
    const [hudMessage, setHudMessage] = useState(null);

    const showHUD = useCallback((message) => {
        setHudMessage(message);
    }, []);

    const hideHUD = useCallback(() => {
        setHudMessage(null);
    }, []);

    return (
        <HUDContext.Provider value={{ hudMessage, showHUD, hideHUD }}>
            {children}
        </HUDContext.Provider>
    );
};

export const useHUD = () => {
    const context = useContext(HUDContext);
    if (!context) {
        throw new Error('useHUD must be used within a HUDProvider');
    }
    return context;
};

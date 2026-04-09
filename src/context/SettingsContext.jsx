import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
    bio_narrative: 0.50,
    client_work: 0.25,
    practice_tags: 0.10,
    industry_tags: 0.10,
    international: 0.02,
    education: 0.03
};

const SETTINGS_STORAGE_KEY = 'afs_analysis_settings';

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    useEffect(() => {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, DEFAULT_SETTINGS }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

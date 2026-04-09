import { APP_CONFIG } from './constants';

export const appConfig = {
  getAppName: () => APP_CONFIG.APP_NAME,
  
  getVersion: () => APP_CONFIG.VERSION,
  
  getLanguage: () => {
    const storedLanguage = localStorage.getItem('app_language');
    return storedLanguage || APP_CONFIG.LANGUAGE;
  },
  
  setLanguage: (language) => {
    localStorage.setItem('app_language', language);
  },
  
  getTheme: () => {
    const storedTheme = localStorage.getItem('app_theme');
    return storedTheme || APP_CONFIG.THEME;
  },
  
  setTheme: (theme) => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
};


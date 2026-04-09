import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
    const { themeMode, toggleTheme } = useTheme();
    const isDark = themeMode === 'dark';

    return (
        <button
            className={styles.toggleContainer}
            onClick={toggleTheme}
            data-theme={themeMode}
            aria-label="Toggle theme"
        >
            <div className={styles.sky}>
                <div className={styles.star} style={{ top: '5px', left: '45px' }} />
                <div className={styles.star} style={{ top: '15px', left: '55px' }} />
                <div className={styles.star} style={{ top: '10px', left: '65px' }} />
                <div className={styles.cloud} style={{ top: '12px', left: '10px' }} />
                <div className={styles.cloud} style={{ top: '18px', left: '25px' }} />
            </div>
            <div className={styles.circle}>
                {themeMode === 'light' ? (
                    <div className={styles.sun} />
                ) : (
                    <div className={styles.moon}>
                        <div className={styles.crater} style={{ top: '4px', left: '4px', width: '4px', height: '4px' }} />
                        <div className={styles.crater} style={{ top: '10px', left: '10px', width: '3px', height: '3px' }} />
                        <div className={styles.crater} style={{ top: '6px', left: '14px', width: '5px', height: '5px' }} />
                    </div>
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;

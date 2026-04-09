import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/common/Modal/Modal';
import InputField from '@/components/common/InputField/InputField';
import { useSettings } from '@/context/SettingsContext';
import styles from './UserSettingsModal.module.css';

const UserSettingsModal = ({ isOpen, onClose }) => {
    const { settings, updateSetting } = useSettings();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        if (value === '' || (numValue >= 0 && numValue <= 1)) {
            updateSetting(name, value);
        }
    };

    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        updateSetting(name, value);
    };

    const fields = [
        { name: 'bio_narrative', label: 'Bio Narrative' },
        { name: 'client_work', label: 'Client Work' },
        { name: 'practice_tags', label: 'Practice Tags' },
        { name: 'industry_tags', label: 'Industry Tags' },
        { name: 'international', label: 'International' },
        { name: 'education', label: 'Education' }
    ];

    const totalSignificance = useMemo(() => {
        return fields.reduce((sum, field) => sum + (parseFloat(settings[field.name]) || 0), 0);
    }, [settings, fields]);

    const isTotalValid = Math.abs(totalSignificance - 1.0) < 0.001;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h2 className={styles.title}>User Analysis Settings</h2>
                        <p className={styles.description}>
                            Fine-tune the importance of each category. Each weight must be between <strong>0.0 and 1.0</strong>, and the sum of all fields must exactly equal <strong>1.0</strong> for a balanced analysis.
                        </p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className={styles.totalSignificanceBar}>
                    <div className={styles.sigLabel}>Total Significance</div>
                    <div className={`${styles.sigValue} ${isTotalValid ? styles.valid : styles.invalid}`}>
                        {totalSignificance.toFixed(2)} / 1.00
                        {isTotalValid && <span className={styles.check}>✓</span>}
                    </div>
                </div>

                <div className={styles.formGrid}>
                    {fields.map(field => (
                        <div key={field.name} className={styles.settingRow}>
                            <div className={styles.rowTop}>
                                <label className={styles.fieldLabel}>{field.label}</label>
                                <span className={styles.fieldValue}>{(parseFloat(settings[field.name]) || 0).toFixed(2)}</span>
                            </div>
                            <div className={styles.rowControls}>
                                <input
                                    type="range"
                                    name={field.name}
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={settings[field.name] || 0}
                                    onChange={handleSliderChange}
                                    className={styles.compactSlider}
                                />
                                <div className={styles.inputWrap}>
                                    <InputField
                                        type="number"
                                        name={field.name}
                                        value={settings[field.name]}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        className={styles.smallInput}
                                        hideClearButton={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    {!isTotalValid && (
                        <span className={styles.warningText}>Total must be 1.00</span>
                    )}
                    <button
                        className={`${styles.doneBtn} ${!isTotalValid ? styles.disabled : ''}`}
                        onClick={onClose}
                        disabled={false} // Allowing close even if invalid, but highlighting issue
                    >
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );
};

UserSettingsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default UserSettingsModal;

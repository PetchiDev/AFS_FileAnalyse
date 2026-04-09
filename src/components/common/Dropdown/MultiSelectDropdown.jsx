import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox';
import styles from './Dropdown.module.css';
import ChevronIcon from '../Icon/ChevronIcon';

const MultiSelectDropdown = ({
    options = [],
    value = [],
    onChange = null,
    placeholder = 'Select options',
    disabled = false,
    required = false,
    name = '',
    id = '',
    labelKey = 'label',
    valueKey = 'value',
    width = null,
    height = null,
    radius = null,
    border = null,
    className = '',
    label = '',
    error = false,
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            setSearchTerm(''); // Reset search on close
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const filteredOptions = options.filter(option => {
        const label = typeof option === 'object' ? option[labelKey] : option;
        return String(label).toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSelect = (option) => {
        const optionValue = typeof option === 'object' ? option[valueKey] : option;

        let newValue;
        if (value.includes(optionValue)) {
            newValue = value.filter(v => v !== optionValue);
        } else {
            newValue = [...value, optionValue];
        }

        if (onChange) {
            onChange({
                target: {
                    name,
                    value: newValue,
                    option
                }
            });
        }
    };

    const renderSelectedTags = () => {
        if (!Array.isArray(value) || value.length === 0) return <span className={styles.placeholder}>{placeholder}</span>;

        return (
            <div className={styles.tagsContainer}>
                {value.map(v => {
                    const option = options.find(o => (typeof o === 'object' ? o[valueKey] : o) === v);
                    const label = option ? (typeof option === 'object' ? option[labelKey] : option) : null;
                    if (!label) return null;

                    return (
                        <div key={v} className={styles.tag} onClick={(e) => e.stopPropagation()}>
                            <span className={styles.tagLabel}>{label}</span>
                            <button
                                type="button"
                                className={styles.tagRemove}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(option);
                                }}
                                aria-label={`Remove ${label}`}
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    const wrapperStyles = {
        '--dropdown-width': width,
    };

    const innerStyles = {
        '--dropdown-height': height,
        '--dropdown-radius': radius,
        '--dropdown-border': border,
    };

    return (
        <div className={`${styles.dropdownWrapper} ${className}`} ref={dropdownRef} style={wrapperStyles}>
            {label && (
                <label className={styles.label} htmlFor={id}>
                    {label} {required && <span className={styles.requiredMark}>*</span>}
                </label>
            )}
            <div
                className={`${styles.dropdown} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''} ${error ? styles.error : ''}`}
                style={innerStyles}
                onClick={handleToggle}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={placeholder}
            >
                <div className={`${styles.selectedValue} ${value && value.length > 0 ? styles.hasValue : ''}`}>
                    {renderSelectedTags()}
                </div>
                <div className={styles.dropdownIcons}>
                    {value && value.length > 0 && !disabled && (
                        <div
                            className={styles.clearIcon}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onChange) {
                                    onChange({
                                        target: {
                                            name,
                                            value: []
                                        }
                                    });
                                }
                            }}
                            role="button"
                            aria-label="Clear selections"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    )}
                    <ChevronIcon
                        orientation={isOpen ? 'up' : 'down'}
                        className={styles.arrow}
                    />
                </div>
            </div>

            {isOpen && !disabled && (
                <div className={styles.dropdownMenu} style={{ padding: '0' }}>
                    <div className={styles.searchWrapper}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    {filteredOptions.length === 0 ? (
                        <div className={styles.noOptionsMessage}>No options available</div>
                    ) : (
                        filteredOptions.map((option, index) => {
                            const optionValue = typeof option === 'object' ? option[valueKey] : option;
                            const optionLabel = typeof option === 'object' ? option[labelKey] : option;
                            const isSelected = Array.isArray(value) && value.includes(optionValue);

                            return (
                                <div
                                    key={index}
                                    className={`${styles.dropdownItem} ${isSelected ? styles.selected : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(option);
                                    }}
                                    role="option"
                                    aria-selected={isSelected}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleSelect(option)}
                                        label=""
                                        className={styles.dropdownCheckbox}
                                    />
                                    <span>{optionLabel}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

MultiSelectDropdown.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.shape({
                label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
            })
        ])
    ),
    value: PropTypes.array,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    name: PropTypes.string,
    id: PropTypes.string,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    border: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.bool
};

export default MultiSelectDropdown;

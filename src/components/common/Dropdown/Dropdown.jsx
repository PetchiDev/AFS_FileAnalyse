import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { API } from '@/config/constants';
import styles from './Dropdown.module.css';
import ChevronIcon from '../Icon/ChevronIcon';

const fetchDropdownData = async (apiUrl, dataKey) => {
  const fullUrl = apiUrl.startsWith('http') ? apiUrl : `${API.BASE_URL}${apiUrl}`;
  const response = await apiClient.get(fullUrl);
  return dataKey ? response.data[dataKey] : response.data;
};

const Dropdown = ({
  options = null,
  apiUrl = null,
  dataKey = null,
  value = '',
  onChange = null,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  name = '',
  id = '',
  labelKey = 'label',
  valueKey = 'value',
  width = null,
  height = null,
  top = null,
  left = null,
  radius = null,
  borderWidth = null,
  border = null,
  backgroundColor = null,
  className = '',
  label = '',
  error = false,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const queryKey = apiUrl ? ['dropdown', apiUrl] : null;

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const { data: apiData, isLoading, error: apiError } = useQuery({
    queryKey,
    queryFn: () => fetchDropdownData(apiUrl, dataKey),
    enabled: !!apiUrl,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  });

  const dropdownOptions = apiUrl ? (apiData || []) : (options || []);

  const filteredOptions = dropdownOptions.filter(option => {
    const label = typeof option === 'object' ? option[labelKey] : option;
    return String(label).toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

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

  const handleSelect = (option) => {
    const optionValue = typeof option === 'object' ? option[valueKey] : option;
    const optionLabel = typeof option === 'object' ? option[labelKey] : option;

    setSelectedValue(optionValue);
    setIsOpen(false);
    setSearchTerm('');

    if (onChange) {
      onChange({
        target: {
          name,
          value: optionValue,
          label: optionLabel,
          option
        }
      });
    }
  };

  const getSelectedLabel = () => {
    if (!selectedValue) return placeholder;

    const selectedOption = dropdownOptions.find(
      (option) => (typeof option === 'object' ? option[valueKey] : option) === selectedValue
    );

    if (selectedOption) {
      return typeof selectedOption === 'object' ? selectedOption[labelKey] : selectedOption;
    }

    return placeholder;
  };

  // Use CSS variables for dynamic styles to avoid direct inline styles
  const wrapperStyles = {
    '--dropdown-width': width,
    '--dropdown-top': top !== null ? `${top}px` : undefined,
    '--dropdown-left': left !== null ? `${left}px` : undefined,
  };

  const innerStyles = {
    '--dropdown-height': height,
    '--dropdown-radius': radius,
    '--dropdown-border-width': borderWidth,
    '--dropdown-border': border,
    '--dropdown-bg': backgroundColor,
  };

  const containerClasses = [
    styles.dropdownWrapper,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} ref={dropdownRef} style={wrapperStyles}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label} {required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}
      <input type="hidden" name={name} value={selectedValue} />
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
        <span className={`${styles.selectedValue} ${selectedValue ? styles.hasValue : ''}`}>
          {isLoading ? 'Loading...' : getSelectedLabel()}
        </span>
        <div className={styles.dropdownIcons}>
          {selectedValue && !disabled && (
            <div
              className={styles.clearIcon}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('');
              }}
              role="button"
              aria-label="Clear selection"
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
        <div className={styles.dropdownMenu}>
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
          {apiError ? (
            <div className={styles.errorMessage}>Error loading options</div>
          ) : isLoading ? (
            <div className={styles.loadingMessage}>Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className={styles.noOptionsMessage}>No options available</div>
          ) : (
            filteredOptions.map((option, index) => {
              const optionValue = typeof option === 'object' ? option[valueKey] : option;
              const optionLabel = typeof option === 'object' ? option[labelKey] : option;
              const isSelected = selectedValue === optionValue;

              return (
                <div
                  key={index}
                  className={`${styles.dropdownItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={isSelected}
                >
                  {optionLabel}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
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
  apiUrl: PropTypes.string,
  dataKey: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  backgroundColor: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool
};

export default Dropdown;


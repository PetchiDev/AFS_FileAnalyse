import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextArea.module.css';

const TextArea = ({
  placeholder = '',
  value = '',
  onChange = null,
  disabled = false,
  required = false,
  name = '',
  id = '',
  width = '100%',
  height = '120px',
  radius = '8px',
  border = '1.5px solid var(--color-border, #E2E8F0)',
  color = 'var(--color-text-primary, #1E293B)',
  className = '',
  rows = 4,
  label = '',
  showCounter = false,
  showCharCount = false, // Added to support both names
  maxLength = null,
  error = false,       // Destructure error
  ...rest
}) => {
  const isShowCounter = showCounter || showCharCount;
  const inlineStyles = {
    width,
    height,
    borderRadius: radius,
    border,
    color
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({
        target: {
          name,
          id,
          value: ''
        }
      });
    }
  };

  return (
    <div className={styles.container} style={{ width }}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label} {required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}
      <div className={styles.textAreaWrapper}>
        <textarea
          className={`${styles.textArea} ${className} ${error ? styles.error : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          rows={rows}
          maxLength={maxLength}
          style={{ ...inlineStyles, width: '100%' }}
          {...rest}
        />
        {value && !disabled && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear text"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      {isShowCounter && maxLength && (
        <div className={`${styles.counter} ${value.length >= maxLength ? styles.counterMax : ''}`}>
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.number,
  error: PropTypes.bool,
  label: PropTypes.string,
  showCounter: PropTypes.bool,
  maxLength: PropTypes.number
};

export default TextArea;

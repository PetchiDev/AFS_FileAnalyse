import React from 'react';
import PropTypes from 'prop-types';
import styles from './InputField.module.css';

const InputField = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = null,
  disabled = false,
  required = false,
  name = '',
  id = '',
  width = null,
  height = null,
  top = null,
  left = null,
  radius = null,
  border = null,
  color = null,
  className = '',
  label = '',
  showCounter = false,
  showCharCount = false, // Added to support both names
  helperText = '',     // Added to support helper text
  maxLength = null,
  error = false,       // Destructure error to avoid passing to DOM
  hideClearButton = false,
  ...rest
}) => {
  const isShowCounter = showCounter || showCharCount;
  const inlineStyles = {};

  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;
  if (top !== null) inlineStyles.top = top;
  if (left !== null) inlineStyles.left = left;
  if (radius !== null) inlineStyles.borderRadius = radius;
  if (border) inlineStyles.border = border;
  if (color) inlineStyles.color = color;

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
    <div className={styles.container} style={width ? { width } : undefined}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label} {required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}
      <div
        className={styles.inputWrapper}
      >
        <input
          type={type}
          className={`${styles.inputField} ${className} ${error ? styles.error : ''} ${value ? styles.hasValue : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          maxLength={maxLength}
          style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
          {...rest}
        />
        {value !== '' && value !== null && value !== undefined && !disabled && !hideClearButton && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear input"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      {helperText && <div className={styles.helperText}>{helperText}</div>}
      {isShowCounter && maxLength && (
        <div className={`${styles.counter} ${value.length >= maxLength ? styles.counterMax : ''}`}>
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'search',
    'date',
    'time',
    'datetime-local'
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  color: PropTypes.string,
  label: PropTypes.string,
  showCounter: PropTypes.bool,
  maxLength: PropTypes.number,
  hideClearButton: PropTypes.bool
};

export default InputField;


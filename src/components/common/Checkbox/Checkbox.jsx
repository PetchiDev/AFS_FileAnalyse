import React from 'react';
import PropTypes from 'prop-types';
import styles from './Checkbox.module.css';

const Checkbox = ({
  checked = false,
  onChange = null,
  disabled = false,
  label = '',
  name = '',
  id = '',
  value = '',
  width = null,
  height = null,
  top = null,
  left = null,
  radius = null,
  border = null,
  className = '',
  ...rest
}) => {
  const handleChange = (event) => {
    if (onChange && !disabled) {
      onChange(event);
    }
  };

  const inlineStyles = {};

  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;
  if (top !== null) inlineStyles.top = top;
  if (left !== null) inlineStyles.left = left;
  if (radius !== null) inlineStyles.borderRadius = radius;
  if (border) inlineStyles.border = border;

  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.checkboxWrapper} ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.checkboxInput}
        style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
        {...rest}
      />
      <label
        htmlFor={checkboxId}
        className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''}`}
      >
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  className: PropTypes.string
};

export default Checkbox;


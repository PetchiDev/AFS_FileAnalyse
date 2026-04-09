import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = React.forwardRef(({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  isLoading = false, // Added to support both names
  type = 'button',
  fullWidth = false,
  icon = null,
  icons = null,
  width = null,
  height = null,
  top = null,
  left = null,
  radius = null,
  border = null,
  color = null,
  textColor = null,
  ...rest
}, ref) => {
  const isDataLoading = loading || isLoading;
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDataLoading && styles.loading
  ].filter(Boolean).join(' ');

  const inlineStyles = {};

  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;
  if (top !== null) inlineStyles.top = top;
  if (left !== null) inlineStyles.left = left;
  if (radius !== null) inlineStyles.borderRadius = radius;
  if (border) inlineStyles.border = border;
  if (color) inlineStyles.backgroundColor = color;
  if (textColor) inlineStyles.color = textColor;

  const renderIcons = () => {
    if (icons && Array.isArray(icons) && icons.length > 0) {
      return icons.map((iconItem, index) => (
        <span key={index} className={styles.icon}>
          {iconItem}
        </span>
      ));
    }
    if (icon) {
      return <span className={styles.icon}>{icon}</span>;
    }
    return null;
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
      onClick={onClick}
      disabled={disabled || isDataLoading}
      {...rest}
    >
      {isDataLoading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {renderIcons()}
          {children}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'white']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  icons: PropTypes.arrayOf(PropTypes.node),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  color: PropTypes.string,
  textColor: PropTypes.string
};

export default Button;


import React from 'react';
import PropTypes from 'prop-types';
import styles from './Icon.module.css';

const Icon = ({ 
  src, 
  alt = '', 
  className = '', 
  size = 'medium',
  ...props 
}) => {
  const iconClasses = [
    styles.icon,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const ImgComponent = src;

  return (
    <ImgComponent 
      className={iconClasses}
      aria-label={alt}
      role="img"
      {...props}
    />
  );
};

Icon.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Icon;


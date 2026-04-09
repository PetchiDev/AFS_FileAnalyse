import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({
  children,
  width = null,
  height = null,
  top = null,
  left = null,
  radius = null,
  border = null,
  color = null,
  onClick = null,
  className = '',
  ...rest
}) => {
  const inlineStyles = {};

  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;
  if (top !== null) inlineStyles.top = top;
  if (left !== null) inlineStyles.left = left;
  if (radius !== null) inlineStyles.borderRadius = radius;
  if (border) inlineStyles.border = border;
  if (color) inlineStyles.backgroundColor = color;

  const cardClasses = [
    styles.card,
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Card;


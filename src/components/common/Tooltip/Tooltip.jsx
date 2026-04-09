import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Tooltip.module.css';

const Tooltip = ({ children, content, position = 'top', delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const timeoutId = useRef(null);

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  const showTooltip = () => {
    if (!content) return;
    updateCoords();
    timeoutId.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  // Simple position calculation
  const getTooltipStyle = () => {
    if (!coords.top) return {};
    
    // Default offsets
    let top = coords.top;
    let left = coords.left + coords.width / 2;

    if (position === 'top') {
      top -= 10; // Gap
      return { top: `${top}px`, left: `${left}px`, transform: 'translate(-50%, -100%)' };
    }
    if (position === 'bottom') {
      top += coords.height + 10;
      return { top: `${top}px`, left: `${left}px`, transform: 'translateX(-50%)' };
    }
    // Add more as needed
    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <div 
      ref={containerRef}
      className={styles.tooltipContainer} 
      onMouseEnter={showTooltip} 
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && ReactDOM.createPortal(
        <div 
          className={`${styles.tooltipBody} ${styles[position]}`}
          style={getTooltipStyle()}
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
};

export default Tooltip;

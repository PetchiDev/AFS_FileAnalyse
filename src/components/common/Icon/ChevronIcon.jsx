import React from 'react';

const ChevronIcon = ({ size = 12, className = '', orientation = 'down' }) => {
    const rotation = orientation === 'up' ? 'rotate(180deg)' : 'none';

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ transform: rotation, transition: 'transform 0.2s ease' }}
        >
            <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ChevronIcon;

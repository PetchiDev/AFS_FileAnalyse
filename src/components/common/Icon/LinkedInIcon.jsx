import React from 'react';

const LinkedInIcon = ({ size = 18, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M16 8C17.5913 8 19.1174 8.52678 20.2426 9.46447C21.3679 10.4021 22 11.6739 22 13V21H18V13C18 12.4696 17.7893 11.9609 17.4142 11.5858C17.0391 11.2107 16.5304 11 16 11C15.4696 11 14.9609 11.2107 14.5858 11.5858C14.2107 11.9609 14 12.4696 14 13V21H10V13C10 11.6739 10.6321 10.4021 11.7574 9.46447C12.8826 8.52678 14.4087 8 16 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6 9H2V21H6V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default LinkedInIcon;

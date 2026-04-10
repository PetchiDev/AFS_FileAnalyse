export const API = {
  BASE_URL: (import.meta.env.VITE_API_BASE_URL || 'https://purchase-schedule-formfill-api-eehdh2d0ahavbhf9.eastus2-01.azurewebsites.net').replace(/\/$/, ''),
  ENDPOINTS: {
    // File Processing
    UPLOAD_FILE: '/api/v1/files/upload',
    FILE_STATUS: '/api/v1/files/status',
    FILE_DOWNLOAD: '/api/v1/files/download',
    // Reports
    REPORTS_LIST: '/api/v1/reports',
    REPORT_DOWNLOAD: '/api/v1/reports/download',
    PROCESS_FILES: '/api/v1/process',
    PROCESSINGS: '/api/v1/processings'
  }
};

// MSAL Configuration
export const MSAL_CONFIG = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || '954749a7-37b1-4118-b5c6-e1a12bac6795',
    authority: import.meta.env.VITE_MSAL_AUTHORITY || 'https://login.microsoftonline.com/c84161cf-b68e-4238-864b-45c5301d6889',
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI || 'https://mango-glacier-0a85c100f.1.azurestaticapps.net/upload',
    postLogoutRedirectUri: import.meta.env.VITE_MSAL_POST_LOGOUT_REDIRECT_URI || 'https://mango-glacier-0a85c100f.1.azurestaticapps.net/'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'AFS Schedule Generator',
  VERSION: '1.0.0',
  LANGUAGE: 'en',
  THEME: 'light'
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 20,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/
};

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MAX_FILE_SIZE: 5242880, // 5MB
  ITEMS_PER_PAGE: 10
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  MOBILE_SMALL: 360,
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  DESKTOP_LARGE: 1440
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10485760, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.doc', '.msg'],
  FORMAT_LABELS: ['PDF', 'DOCX', 'DOC', 'MSG'],
  UPLOAD_TITLE: 'Upload Files',
  UPLOAD_SUBTITLE: 'Select one or more files to begin processing',
  DRAG_TEXT: 'Drag files here or click to browse',
  SUPPORTED_TEXT: 'Supported formats:',
  UPLOAD_BUTTON: 'Upload & Analyze',
  MAX_FILE_SIZE_TEXT: 'Max file size: 10MB'
};

// Processing Steps
export const PROCESSING_STEPS = {
  UPLOADING: { id: 'uploading', label: 'Uploading', icon: 'upload' },
  ANALYZING: { id: 'analyzing', label: 'Analyzing with AI', icon: 'ai' },
  MAPPING: { id: 'mapping', label: 'Mapping to Template', icon: 'template' },
  READY: { id: 'ready', label: 'Ready for Download', icon: 'download' }
};

export const PROCESSING_STEPS_LIST = [
  PROCESSING_STEPS.UPLOADING,
  PROCESSING_STEPS.ANALYZING,
  PROCESSING_STEPS.MAPPING,
  PROCESSING_STEPS.READY
];

// Messages
export const MESSAGES = {
  SUCCESS: {
    UPLOAD: 'File uploaded successfully!',
    DOWNLOAD: 'File downloaded successfully!',
    PROCESSING: 'Processing complete!'
  },
  ERROR: {
    GENERIC: 'Something went wrong!',
    NETWORK: 'Network error. Please try again.',
    UNAUTHORIZED: 'You are not authorized.',
    INVALID_FILE: 'Please upload a file in supported format (.docx, .doc, .pdf, .msg)',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10MB.',
    PROCESSING_FAILED: 'File processing failed. Please try again.'
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language'
};

// Routes
export const ROUTES = {
  HOME: '/',
  UPLOAD: '/upload',
  REPORTS: '/reports'
};

// Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Color Constants
export const COLORS = {
  PRIMARY: '#EE202E',
  TEXT: '#65758B',
  WHITE: '#FFFFFF',
  BLACK: '#0F172A',
  SUCCESS: '#10B981',
  ERROR: '#EF4444'
};

// Sidebar Labels
export const SIDEBAR_CONSTANTS = {
  UPLOAD: 'Upload',
  REPORTS: 'Reports'
};

// Reports Page Constants
export const REPORTS_CONSTANTS = {
  TITLE: 'Reports',
  SUBTITLE: 'View and download previously generated files.',
  TABLE_HEADERS: {
    FILE_NAME: 'File Name',
    CREATED_AT: 'Created At',
    ACTION: 'Action'
  },
  DOWNLOAD_BUTTON: 'Download',
  ITEMS_PER_PAGE: 5,
  NO_REPORTS: 'No reports found.'
};

// Mock Reports Data for demonstration
export const MOCK_REPORTS_DATA = [
  {
    id: 1,
    fileName: 'report_001.pdf',
    fileType: 'pdf',
    createdAt: '2026-04-09T12:03:00Z'
  },
  {
    id: 2,
    fileName: 'report_002.docx',
    fileType: 'docx',
    createdAt: '2026-04-07T12:03:00Z'
  },
  {
    id: 3,
    fileName: 'report_003.xlsx',
    fileType: 'xlsx',
    createdAt: '2026-04-05T12:03:00Z'
  },
  {
    id: 4,
    fileName: 'report_004.pdf',
    fileType: 'pdf',
    createdAt: '2026-04-03T12:03:00Z'
  },
  {
    id: 5,
    fileName: 'report_005.docx',
    fileType: 'docx',
    createdAt: '2026-04-01T12:03:00Z'
  },
  {
    id: 6,
    fileName: 'report_006.xlsx',
    fileType: 'xlsx',
    createdAt: '2026-03-30T12:03:00Z'
  },
  {
    id: 7,
    fileName: 'report_007.pdf',
    fileType: 'pdf',
    createdAt: '2026-03-28T12:03:00Z'
  },
  {
    id: 8,
    fileName: 'report_008.docx',
    fileType: 'docx',
    createdAt: '2026-03-26T12:03:00Z'
  },
  {
    id: 9,
    fileName: 'report_009.xlsx',
    fileType: 'xlsx',
    createdAt: '2026-03-24T12:03:00Z'
  },
  {
    id: 10,
    fileName: 'report_010.pdf',
    fileType: 'pdf',
    createdAt: '2026-03-22T12:03:00Z'
  },
  {
    id: 11,
    fileName: 'report_011.docx',
    fileType: 'docx',
    createdAt: '2026-03-20T12:03:00Z'
  },
  {
    id: 12,
    fileName: 'report_012.xlsx',
    fileType: 'xlsx',
    createdAt: '2026-03-18T12:03:00Z'
  }
];

---
alwaysApply: true
---
# React Frontend Development Rules & Standards

## 🎯 Core Principles

### 1. **No Hardcoded Values**
- ALL strings, numbers, URLs, API endpoints MUST be in constants
- NO magic numbers or strings in components
- Configuration-driven development

### 2. **DRY Principle** (Don't Repeat Yourself)
- Reusable components for everything
- Shared utilities and helpers
- Single source of truth

---

## 📁 Project Structure

```
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Card/
│   ├── layout/          # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   └── features/        # Feature-specific components
│       ├── Auth/
│       ├── Dashboard/
│       └── Profile/
├── config/
│   ├── constants.js     # All constants
│   ├── api.config.js    # API configuration
│   └── app.config.js    # App-level config
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useDebounce.js
├── services/            # API services
│   ├── api.js
│   ├── auth.service.js
│   └── user.service.js
├── store/               # State management (Redux/Zustand)
│   ├── slices/
│   └── store.js
├── utils/               # Utility functions
│   ├── helpers.js
│   ├── validators.js
│   └── formatters.js
├── styles/              # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── theme.js
└── App.jsx
```

---

## 📝 Naming Conventions

### **Files & Folders**
```javascript
// Components: PascalCase
Button.jsx
UserProfile.jsx
NavBar.jsx

// Utilities/Services: camelCase
userService.js
authHelper.js
dateFormatter.js

// Constants: UPPER_SNAKE_CASE
API_CONSTANTS.js
APP_CONFIG.js

// Folders: lowercase or kebab-case
components/
common-components/
user-profile/
```

### **Variables & Functions**
```javascript
// Variables: camelCase
const userName = "John";
const isLoggedIn = true;
const userProfileData = {};

// Functions: camelCase with verb prefix
const getUserData = () => {};
const handleSubmit = () => {};
const validateEmail = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";
const MAX_LOGIN_ATTEMPTS = 3;

// Components: PascalCase
const UserDashboard = () => {};
const LoginForm = () => {};

// Boolean variables: is/has/should prefix
const isLoading = false;
const hasPermission = true;
const shouldShowModal = false;

// Event handlers: handle prefix
const handleClick = () => {};
const handleInputChange = () => {};
const handleFormSubmit = () => {};
```

---

## 🔐 Constants Management

### **config/constants.js**
```javascript
// API Configuration
export const API = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  TIMEOUT: 30000,
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    USER_PROFILE: '/user/profile',
    POSTS: '/posts',
    COMMENTS: '/comments'
  }
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'My React App',
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
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ITEMS_PER_PAGE: 10
};

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logged out successfully!',
    SAVE: 'Data saved successfully!'
  },
  ERROR: {
    GENERIC: 'Something went wrong!',
    NETWORK: 'Network error. Please try again.',
    UNAUTHORIZED: 'You are not authorized.'
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
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings'
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
```

### **Usage in Components**
```javascript
import { API, MESSAGES, VALIDATION, UI } from '@/config/constants';

const LoginForm = () => {
  const handleLogin = async (credentials) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        showToast(MESSAGES.SUCCESS.LOGIN, UI.TOAST_DURATION);
      }
    } catch (error) {
      showToast(MESSAGES.ERROR.NETWORK, UI.TOAST_DURATION);
    }
  };

  return (
    <form>
      <input 
        type="password" 
        minLength={VALIDATION.MIN_PASSWORD_LENGTH}
        maxLength={VALIDATION.MAX_PASSWORD_LENGTH}
      />
    </form>
  );
};
```

---

## 🧩 Reusable Component Structure

### **Example: Button Component**

**components/common/Button/Button.jsx**
```javascript
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
  icon = null,
  ...rest 
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.node
};

export default Button;
```

**components/common/Button/index.js**
```javascript
export { default } from './Button';
```

### **Reusable Component Checklist**
- ✅ PropTypes or TypeScript for type safety
- ✅ Default props
- ✅ Flexible and customizable
- ✅ Proper documentation
- ✅ Accessibility attributes
- ✅ Error boundaries where needed

---

## 🔧 Custom Hooks Pattern

**hooks/useFetch.js**
```javascript
import { useState, useEffect } from 'react';
import { API } from '@/config/constants';

const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API.BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
        
        if (!response.ok) throw new Error('Network response failed');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetch;
```

---

## 🎨 Component Best Practices

### **DO ✅**
```javascript
// Good: Clean, readable, constants-driven
import { VALIDATION, MESSAGES } from '@/config/constants';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  
  const validateEmail = (value) => {
    return VALIDATION.EMAIL_REGEX.test(value);
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      showError(MESSAGES.ERROR.INVALID_EMAIL);
      return;
    }
    // Process form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
    </form>
  );
};
```

### **DON'T ❌**
```javascript
// Bad: Hardcoded values, magic numbers
const SignupForm = () => {
  const [email, setEmail] = useState('');
  
  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // ❌ Hardcoded regex
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      alert('Invalid email address'); // ❌ Hardcoded message
      return;
    }
    fetch('https://api.example.com/signup', { // ❌ Hardcoded URL
      method: 'POST',
      body: JSON.stringify({ email })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        maxLength={50} // ❌ Magic number
        placeholder="Type email here" // ❌ Inconsistent text
      />
    </form>
  );
};
```

---

## 🔒 Environment Variables

**.env.example**
```bash
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_API_KEY=your_api_key_here
REACT_APP_ENVIRONMENT=development
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key
```

**Never commit .env files to Git!**

---

## 📋 Code Review Checklist

- [ ] No hardcoded strings, numbers, or URLs
- [ ] All constants in config files
- [ ] Proper naming conventions followed
- [ ] Components are reusable and flexible
- [ ] PropTypes or TypeScript defined
- [ ] No duplicate code
- [ ] Proper error handling
- [ ] Accessibility attributes added
- [ ] Code is well-commented
- [ ] No console.logs in production code

---

## 🚀 Quick Command Reference

```bash
# Create new component with structure
mkdir -p src/components/common/ComponentName
touch src/components/common/ComponentName/{ComponentName.jsx,ComponentName.module.css,index.js}

# Import alias configuration (@/ prefix)
# Add to jsconfig.json or vite.config.js
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```
Router:
use Tanstack Router
and TanStack Query
---

## 💡 Key Takeaways

1. **Constants First**: Before writing any component, define all strings/numbers in constants
2. **Reusability**: If used twice, make it a component
3. **Naming**: Be consistent and descriptive
4. **Structure**: Follow the folder structure strictly
5. **No Magic**: No hardcoded values anywhere in the codebase

**Remember**: Clean code today = Happy developers tomorrow! 🎉
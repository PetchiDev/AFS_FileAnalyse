# AFS React Application

A React application skeleton following AFS development standards and best practices.

## 🎯 Core Principles

1. **No Hardcoded Values** - All strings, numbers, URLs, and API endpoints are in constants
2. **DRY Principle** - Reusable components, utilities, and helpers
3. **Proper Naming Conventions** - Consistent naming across the codebase
4. **Clean Architecture** - Well-organized folder structure

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, icons, fonts)
├── components/       # React components
│   ├── common/       # Reusable UI components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── config/           # Configuration files
│   ├── constants.js  # All constants
│   ├── api.config.js # API configuration
│   └── app.config.js # App-level config
├── hooks/            # Custom React hooks
├── services/         # API services
├── store/            # State management
├── utils/            # Utility functions
├── styles/           # Global styles
└── App.jsx          # Main app component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration values.

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 📝 Key Features

- ✅ Constants-driven development
- ✅ Reusable component structure
- ✅ Custom hooks for common patterns
- ✅ Service layer for API calls
- ✅ Utility functions for common tasks
- ✅ Global styling system with CSS variables
- ✅ React Router setup
- ✅ Proper error handling

## 🔧 Configuration

### Constants

All constants are defined in `src/config/constants.js`:
- API endpoints and configuration
- Validation rules
- UI constants
- Messages
- Storage keys
- Routes

### API Configuration

API calls are handled through `src/config/api.config.js` which provides:
- Automatic authentication headers
- Error handling
- Request timeout
- Response parsing

## 📋 Development Guidelines

1. **No Hardcoded Values** - Always use constants from `config/constants.js`
2. **Component Structure** - Follow the pattern in `components/common/Button/`
3. **Naming Conventions**:
   - Components: PascalCase
   - Functions/Variables: camelCase
   - Constants: UPPER_SNAKE_CASE
4. **Custom Hooks** - Extract reusable logic to hooks
5. **Services** - All API calls through service layer

## 📚 Documentation

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

This project is private and proprietary.


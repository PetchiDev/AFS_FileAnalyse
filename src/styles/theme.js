import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#EE202E', // --color-primary
    },
    background: {
      default: mode === 'light' ? '#FFFFFF' : '#1A1D21',
      paper: mode === 'light' ? '#FFFFFF' : '#1F2937',
    },
    text: {
      primary: mode === 'light' ? '#212529' : '#FFFFFF',
      secondary: mode === 'light' ? '#65758B' : '#ADB5BD',
    }
  },
  typography: {
    fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export const theme = {
  colors: {
    primary: 'var(--color-primary)',
    primaryDark: 'var(--color-primary-dark)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    danger: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    textLight: 'var(--color-text-light)',
    bgPrimary: 'var(--color-bg-primary)',
    bgSecondary: 'var(--color-bg-secondary)',
    bgDark: 'var(--color-bg-dark)',
    headerBg: 'var(--color-header-bg)',
    border: 'var(--color-border)',
    headerBorder: 'var(--color-header-border)',
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)'
  },
  typography: {
    fontFamily: 'var(--font-family-primary)',
    fontSize: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      md: 'var(--font-size-md)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)'
    }
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  },
  transitions: {
    fast: 'var(--transition-fast)',
    base: 'var(--transition-base)',
    slow: 'var(--transition-slow)'
  },
  borderRadius: 'var(--border-radius)'
};

export default theme;


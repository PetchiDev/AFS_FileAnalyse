import React, { useEffect, useState, useMemo } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { msalInstance, initializeAuth } from '@/services/auth.service';
import { router } from '@/router/router';
import { ThemeProvider as ThemeContextProvider, useTheme } from '@/context/ThemeContext';
import { getMuiTheme } from '@/styles/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const { themeMode } = useTheme();
  const muiTheme = useMemo(() => getMuiTheme(themeMode), [themeMode]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeMode === 'dark' ? 'dark' : 'light'}
      />
    </MuiThemeProvider>
  );
};

import { SettingsProvider } from '@/context/SettingsContext';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('MSAL initialization failed:', error);
      }
    };
    init();
  }, []);

  if (!isInitialized) {
    return <div>Loading authentication...</div>;
  }

  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    </MsalProvider>
  );
};

export default App;


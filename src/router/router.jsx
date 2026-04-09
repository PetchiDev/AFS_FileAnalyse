import { createRouter, createRoute, createRootRoute, Outlet, lazyRouteComponent } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { ROUTES } from '@/config/constants';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import '@/styles/globals.css';
import styles from '../App.module.css';

import AuthGuard from '@/components/common/AuthGuard/AuthGuard';
import { useMsal } from '@azure/msal-react';

// Lazy load pages
const Upload = lazyRouteComponent(() => import('@/pages/Upload'));
const Reports = lazyRouteComponent(() => import('@/pages/Reports'));

const AuthenticatedLayout = () => {
  const { accounts } = useMsal();
  const isBypassActive = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const user = accounts[0] || (isBypassActive ? { name: 'Local Developer', username: 'dev@local' } : null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <AuthGuard>
      <div className={styles.app}>
        {/* Header — full width across top */}
        <Header
          userName={user?.name || 'User'}
          userEmail={user?.username || ''}
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Body — sidebar + content side by side */}
        <div className={styles.bodyWrapper}>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleCloseSidebar}
          />
          <main className={styles.contentArea}>
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

const rootRoute = createRootRoute({
  component: Outlet
});

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthenticatedLayout
});

// Index route — defaults to Upload
const indexRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTES.HOME,
  component: Upload
});

// Upload page
const uploadRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTES.UPLOAD,
  component: Upload
});

// Reports page
const reportsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTES.REPORTS,
  component: Reports
});

const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([
    indexRoute,
    uploadRoute,
    reportsRoute
  ])
]);

export const router = createRouter({ routeTree });

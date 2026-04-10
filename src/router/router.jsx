import { createRouter, createRoute, createRootRoute, Outlet, lazyRouteComponent } from '@tanstack/react-router';
import { ROUTES } from '@/config/constants';
import Header from '@/components/layout/Header';
import '@/styles/globals.css';
import styles from '../App.module.css';

import AuthGuard from '@/components/common/AuthGuard/AuthGuard';
import { useMsal } from '@azure/msal-react';

// Lazy load pages
const Dashboard = lazyRouteComponent(() => import('@/pages/Dashboard/Dashboard'));
const Upload = lazyRouteComponent(() => import('@/pages/Upload'));
const Reports = lazyRouteComponent(() => import('@/pages/Reports'));

const AuthenticatedLayout = () => {
  const { accounts } = useMsal();
  const isBypassActive = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const user = accounts[0] || (isBypassActive ? { name: 'Jhon Doe', username: 'dev@local' } : null);

  return (
    <AuthGuard>
      <div className={styles.app}>
        {/* Header — full width across top */}
        <Header
          userName={user?.name || 'User'}
          userEmail={user?.username || ''}
        />

        {/* Body — content fills remaining space */}
        <div className={styles.bodyWrapper}>
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

// Index route — defaults to Dashboard
const indexRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTES.HOME,
  component: Dashboard
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

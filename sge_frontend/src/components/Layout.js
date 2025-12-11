import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from './AppLayout';

/**
 * PUBLIC_INTERFACE
 * Layout wrapper that composes the shared AppLayout and renders nested routes via <Outlet />.
 * This retains existing route structure while adding responsive sidebar controls and topbar hamburger.
 */
const Layout = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default Layout;

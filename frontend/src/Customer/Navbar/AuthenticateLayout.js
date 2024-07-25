// src/Customer/Navbar/AuthenticatedLayout.js

import React from 'react';
import StickyNavbar from './Navbar';
import Layout from './Layout';
import { SidebarProvider } from './SidebarContext';

const AuthenticatedLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <StickyNavbar />
      <Layout>
        {children}
      </Layout>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;

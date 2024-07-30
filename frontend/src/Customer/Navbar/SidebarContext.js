import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  return useContext(SidebarContext);
};

export const SidebarProvider = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(prevState => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

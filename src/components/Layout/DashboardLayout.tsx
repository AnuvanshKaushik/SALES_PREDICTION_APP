import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../UI/ToastContainer';

const titles: Record<string, string> = {
  '/dashboard': 'Sales Prediction Dashboard',
  '/analytics': 'Sales Analytics',
  '/inventory': 'Inventory Management',
  '/settings': 'Settings'
};

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedState = localStorage.getItem('salespro_sidebar_collapsed');
    if (savedState) {
      setSidebarCollapsed(JSON.parse(savedState));
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('salespro_sidebar_collapsed', JSON.stringify(newState));
  };

  const currentTitle = titles[location.pathname] || 'SalesPro Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-64'}`}>
        <Header onSidebarToggle={toggleSidebar} title={currentTitle} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { LayoutProps } from '../../types/components';
import { useTheme } from '../../contexts/ThemeContext';
import './Layout.css';

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`layout ${className}`} data-theme={theme}>
      <Navbar />
      <main className="main-content">
        {children || <Outlet />}
      </main>
      <footer className="footer">
        <div className="container">
          <p className="text-center">
            &copy; {new Date().getFullYear()} Luis Cedillo Maldonado. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

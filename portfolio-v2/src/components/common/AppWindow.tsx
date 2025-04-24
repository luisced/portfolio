import React, { ReactNode } from 'react';
import './AppWindow.css';

interface AppWindowProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

const AppWindow: React.FC<AppWindowProps> = ({ id, className = '', children }) => {
  return (
    <div id={id} className={`app-window ${className}`}>
      <div className="header">
        <div className="menu-circle"></div>
        <div className="header-menu"></div>
      </div>
      {children}
    </div>
  );
};

export default AppWindow;

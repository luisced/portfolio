import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../components/common/Background';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <Background />
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

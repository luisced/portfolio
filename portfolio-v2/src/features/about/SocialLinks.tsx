import React from 'react';
import { FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa';
import cv from '../../assets/documents/Luis Cedillo Maldonado CV.pdf';
import './SocialLinks.css';

const socialLinks = [
  {
    href: 'https://github.com/luisced',
    icon: FaGithub,
    title: 'Check out my GitHub',
  },
  {
    href: 'https://linkedin.com/in/luisced',
    icon: FaLinkedin,
    title: 'Connect with me on LinkedIn',
  },
];

const SocialLinks: React.FC = () => {
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = cv;
    link.download = 'Luis_Cedillo_Maldonado_CV.pdf';
    link.click();
  };
  
  return (
    <div className="social-links">
      {socialLinks.map(({ href, icon: Icon, title }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
        >
          <Icon />
        </a>
      ))}
      <button
        onClick={handleDownloadCV}
        title="Download my CV"
        className="download-cv"
        aria-label="Download my CV"
      >
        Download my CV <FaDownload />
      </button>
    </div>
  );
};

export default SocialLinks;

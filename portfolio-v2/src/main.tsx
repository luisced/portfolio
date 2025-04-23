import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import { loadFonts, loadNonCriticalFonts } from './utils/fontLoader';

// Initialize font loading optimizations
loadFonts();
loadNonCriticalFonts();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

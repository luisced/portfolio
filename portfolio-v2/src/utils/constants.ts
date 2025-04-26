/**
 * Application-wide constants
 */

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PORTFOLIO: '/portfolio',
  CONTACT: '/contact',
};

// Animation durations (in ms)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

// Breakpoints (in px)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP: 1200,
  LARGE_DESKTOP: 1600,
};

// API endpoints
export const API = {
  BASE_URL: 'https://mail.luiscedillo.com',
  CONTACT_FORM: '/api/contact',
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'portfolio-theme',
  LANGUAGE: 'portfolio-language',
};

// Default values
export const DEFAULTS = {
  THEME: 'dark',
  LANGUAGE: 'en',
  ITEMS_PER_PAGE: 6,
};

// Social media links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/luisced',
  LINKEDIN: 'https://linkedin.com/in/luisced',
  INSTAGRAM: 'https://www.instagram.com/lui._.cedm',
};

// Contact information
export const CONTACT_INFO = {
  EMAIL: 'me@luiscedillo.com',
  WHATSAPP: '5571967146',
};

// SEO defaults
export const SEO = {
  TITLE: 'Luis Cedillo - Full Stack Developer',
  DESCRIPTION: 'Backend developer & cloud engineer passionate about building scalable, maintainable solutions.',
  KEYWORDS: 'developer, full stack, backend, cloud, engineer, react, python, aws',
  OG_IMAGE: '/meta-cover.webp',
};

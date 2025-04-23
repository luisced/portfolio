/**
 * Font loading optimization utility
 * This helps manage font loading and provides a way to detect when fonts are loaded
 */

/**
 * Loads the Inter font and adds a class to the document when loaded
 * This can be used to prevent layout shifts and implement progressive enhancement
 */
export const loadFonts = (): void => {
  // Check if the Font Loading API is supported
  if ('fonts' in document) {
    // Load the Inter font
    Promise.all([
      document.fonts.load('1em Inter'),
      document.fonts.load('bold 1em Inter'),
      document.fonts.load('italic 1em Inter')
    ]).then(() => {
      // Add a class to the document when fonts are loaded
      document.documentElement.classList.add('fonts-loaded');
    }).catch((error) => {
      console.warn('Font loading failed:', error);
      // Still add the class to prevent waiting indefinitely
      document.documentElement.classList.add('fonts-loaded');
    });
  } else {
    // Fallback for browsers that don't support the Font Loading API
    // Just add the class immediately
    document.documentElement.classList.add('fonts-loaded');
  }
};

/**
 * Add a small delay before loading non-critical fonts
 * This helps prioritize critical content rendering
 */
export const loadNonCriticalFonts = (): void => {
  // Wait until the page has loaded
  window.addEventListener('load', () => {
    // Add a small delay to ensure critical content is rendered first
    setTimeout(() => {
      // You can load additional font weights or styles here if needed
      if ('fonts' in document) {
        // Load additional font weights
        Promise.all([
          document.fonts.load('300 1em Inter'), // Light
          document.fonts.load('500 1em Inter'), // Medium
          document.fonts.load('900 1em Inter')  // Black
        ]).catch(error => {
          console.warn('Non-critical font loading failed:', error);
        });
      }
    }, 100); // Small delay to prioritize critical content
  });
};

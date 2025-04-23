/**
 * Font loading optimization utility
 * This helps manage font loading and provides a way to detect when fonts are loaded
 */

/**
 * Adds a class to the HTML element to indicate fonts are loaded
 */
const addFontsLoadedClass = (): void => {
  // Use a type assertion to tell TypeScript that document.documentElement is an HTMLElement
  const htmlElement = document.documentElement as HTMLHtmlElement;
  htmlElement.classList.add('fonts-loaded');
};

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
      addFontsLoadedClass();
    }).catch((error) => {
      console.warn('Font loading failed:', error);
      // Still add the class to prevent waiting indefinitely
      addFontsLoadedClass();
    });
  } else {
    // Fallback for browsers that don't support the Font Loading API
    // Just add the class immediately
    addFontsLoadedClass();
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

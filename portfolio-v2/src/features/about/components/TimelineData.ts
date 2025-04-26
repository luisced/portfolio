// Import language-specific timeline data
import { TimelineExperience, experiences as enExperiences } from './data/TimelineDataEn';
import { experiences as esExperiences } from './data/TimelineDataEs';

// Re-export the TimelineExperience interface
export type { TimelineExperience };

/**
 * Get experiences data based on the current language
 * @param language - The current language code (e.g., 'en', 'es')
 * @returns Array of experiences in the specified language
 */
export const getExperiences = (language = 'en'): TimelineExperience[] => {
  // Return the appropriate language version
  switch (language) {
    case 'es':
      return esExperiences;
    case 'en':
    default:
      return enExperiences;
  }
};

// Export default English experiences for backward compatibility
export const experiences = enExperiences;

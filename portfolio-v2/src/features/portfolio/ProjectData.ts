// Import language-specific project data
import { projects as enProjects } from './data/ProjectDataEn';
import { projects as esProjects } from './data/ProjectDataEs';
import { Project } from "../../types/project";

/**
 * Get projects data based on the current language
 * @param language - The current language code (e.g., 'en', 'es')
 * @returns Array of projects in the specified language
 */
export const getProjects = (language = 'en'): Project[] => {
  // Return the appropriate language version
  switch (language) {
    case 'es':
      return esProjects;
    case 'en':
    default:
      return enProjects;
  }
};

// Export default English projects for backward compatibility
export const projects = enProjects;

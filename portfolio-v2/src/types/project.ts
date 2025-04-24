/**
 * Types for project data
 */

export interface ProjectImage {
  src: string;
  alt: string;
  platform: 'Mobile' | 'Desktop' | 'Tablet';
}

export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  category: string;
  projectCategory: string;
  images: ProjectImage[];
  previewImage?: string;    // Optional special preview image
  technologies?: string[];  // Technologies used in the project
  featuresList?: string[];  // List of key features
  url?: string;             // Live demo URL
  github?: string;          // GitHub repository URL
}

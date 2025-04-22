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
  technologies?: string[];  // New field to display tech stack
  url?: string;             // New field for live demo links
  github?: string;          // New field for repository links
}

/**
 * Types for component props
 */

import { ReactNode } from 'react';
import { ProjectImage } from './project';

// Common props
export interface ChildrenProps {
  children: ReactNode;
}

// Layout components
export interface LayoutProps extends ChildrenProps {
  className?: string;
}

export interface NavbarProps {
  className?: string;
}

// Feature components
export interface AboutProps {
  className?: string;
}

export interface PortfolioProps {
  className?: string;
}

export interface ContactProps {
  className?: string;
}

// Project components
export interface ProjectOverviewProps {
  projectNumber: string;
  title: string;
  role: string;
  description: string;
  category: string;
  images: ProjectImage[];
  technologies?: string[];
  url?: string;
  github?: string;
}

// UI components
export interface ButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  ariaLabel?: string;
}

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export interface BackgroundProps {
  className?: string;
}

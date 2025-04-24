
import pythonIcon from '../assets/icons/python.svg';
import reactIcon from '../assets/icons/react.svg';
import dockerIcon from '../assets/icons/docker.svg';
import javascriptIcon from '../assets/icons/javascript.svg';
import html5Icon from '../assets/icons/html5.svg';
import css3Icon from '../assets/icons/css3.svg';
import fastapiIcon from '../assets/icons/fastapi.svg';
import djangoIcon from '../assets/icons/django.svg';
import postgresIcon from '../assets/icons/postgres.svg';
import mysqlIcon from '../assets/icons/mysql.svg';
import viteIcon from '../assets/icons/vite.svg';
import kubernetesIcon from '../assets/icons/kubernetes.svg';
import awsIcon from '../assets/icons/aws.svg';
import firebaseIcon from '../assets/icons/firebase.svg';
import rustIcon from '../assets/icons/rust.svg';
import redisIcon from '../assets/icons/redis.svg';
import goIcon from '../assets/icons/go.svg';
import svelteIcon from '../assets/icons/svelte.svg';
import typescriptIcon from '../assets/icons/typescript.svg';
import bashIcon from '../assets/icons/bash.svg';
import swiftIcon from '../assets/icons/swift.svg';
import flaskIcon from '../assets/icons/flask.svg';
import { FaBrain, FaMobileAlt, FaRobot, FaEye } from 'react-icons/fa';
// Import other icons as you add them

export interface TechIconInfo {
  name: string;
  icon: string;
  altText?: string;
}

// Map of technology names to their icons
export const techIconMap: Record<string, string | React.ComponentType> = {
  'python': pythonIcon,
  'react': reactIcon,
  'docker': dockerIcon,
  'javascript': javascriptIcon,
  'html5': html5Icon,
  'css3': css3Icon,
  'fastapi': fastapiIcon,
  'django': djangoIcon,
  'postgres': postgresIcon,
  'mysql': mysqlIcon,
  'vite': viteIcon,
  'kubernetes': kubernetesIcon,
  'aws': awsIcon,
  'firebase': firebaseIcon,
  'rust': rustIcon,
  'redis': redisIcon,
  'go': goIcon,
  'svelte': svelteIcon,
  'typescript': typescriptIcon,
  'bash': bashIcon,
  'swift': swiftIcon,
  'flask': flaskIcon,
  'computer vision': FaEye,
  'ai': FaBrain,
  'arkit': FaMobileAlt,
  'coreml': FaBrain,
  'generative ai': FaRobot,
  // Common variations
  'js': javascriptIcon,
  'html': html5Icon,
  'css': css3Icon,
  'postgresql': postgresIcon,
  'vitejs': viteIcon,
  'k8s': kubernetesIcon,
  'amazon web services': awsIcon,
  'golang': goIcon,
  'ts': typescriptIcon,
  'shell': bashIcon,
  'swiftui': swiftIcon,
};

// Helper function to get icon for a technology
export function getTechIcon(techName: string): string | React.ComponentType | undefined {
  // First try with the exact name (case-insensitive)
  const exactMatch = Object.keys(techIconMap).find(
    key => key.toLowerCase() === techName.toLowerCase()
  );
  
  if (exactMatch) {
    return techIconMap[exactMatch];
  }
  
  // If no exact match, try with normalized name (lowercase, no spaces)
  const normalizedName = techName.toLowerCase().replace(/\s+/g, '');
  const normalizedMatch = Object.keys(techIconMap).find(
    key => key.toLowerCase().replace(/\s+/g, '') === normalizedName
  );
  
  if (normalizedMatch) {
    return techIconMap[normalizedMatch];
  }
  
  // If still no match, return undefined
  return undefined;
}

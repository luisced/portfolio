# Luis Cedillo Maldonado Portfolio

This is the personal portfolio website for Luis Cedillo Maldonado, showcasing skills, projects, and professional experience.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Visual Effects**:
  - Spline for 3D elements
  - Framer Motion for animations
  - TypeAnimation for typing effects
- **Styling**: CSS with CSS Variables for theming
- **Icons**: React Icons

## Features

- Modern, responsive design
- Dark/light theme support
- Interactive 3D elements
- Optimized performance with code splitting and lazy loading
- TypeScript for improved developer experience and type safety

## Project Structure

```
src/
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable components
│   ├── common/       # Shared UI elements
│   └── layout/       # Layout components
├── contexts/         # React context providers
├── features/         # Feature-based modules
│   ├── about/
│   ├── home/
│   ├── portfolio/
│   └── contact/
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── pages/            # Page components
├── services/         # API and external services
├── styles/           # Global styles and theme
└── types/            # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd portfolio-v2

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Deployment

This project can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## License

All rights reserved. This code is not open source.

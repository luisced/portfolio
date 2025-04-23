import React, { useState, useEffect } from 'react';
import { projects } from './ProjectData';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import { Project } from '../../types/project';
import './ProjectList.css';

interface ProjectListProps {
  className?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ className }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  
  // Get unique categories for filter
  const categories = ['All', ...new Set(projects.map(project => project.projectCategory))];
  
  // Filter projects when filter changes
  useEffect(() => {
    if (filter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.projectCategory === filter));
    }
  }, [filter]);
  
  // Handle project click
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Handle close detail view
  const handleCloseDetail = () => {
    setSelectedProject(null);
    // Restore scrolling
    document.body.style.overflow = '';
  };

  return (
    <div className={`project-list ${className || ''}`}>
      <div className="filter-container">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={handleProjectClick}
          />
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="no-projects">
          <p>No projects found in this category.</p>
        </div>
      )}
      
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default ProjectList;

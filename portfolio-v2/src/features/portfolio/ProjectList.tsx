import React, { useState, useEffect } from 'react';
import { projects } from './ProjectData';
import ProjectCard from './ProjectCard';
import { Project } from '../../types/project';
import './ProjectList.css';

interface ProjectListProps {
  className?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ className }) => {
  const [filter, setFilter] = useState<string>('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  
  // Extract all unique technologies from projects
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => techSet.add(tech));
      }
    });
    return ['All', ...Array.from(techSet)];
  }, []);
  
  // Filter projects when filter changes
  useEffect(() => {
    if (filter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project => 
          project.technologies && project.technologies.includes(filter)
        )
      );
    }
  }, [filter]);

  return (
    <div className={`project-list ${className || ''}`}>
      <div className="filter-container">
        {allTechnologies.map(tech => (
          <button
            key={tech}
            className={`filter-button ${filter === tech ? 'active' : ''}`}
            onClick={() => setFilter(tech)}
          >
            {tech}
          </button>
        ))}
      </div>
      
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="no-projects">
            <p>No projects found with the selected technology.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;

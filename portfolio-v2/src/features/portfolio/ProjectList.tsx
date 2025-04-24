import React, { useState, useEffect } from 'react';
import { projects } from './ProjectData';
import ProjectCard from './ProjectCard';
import TechIcon from '../../components/common/TechIcon';
import { FaTimes } from 'react-icons/fa';
import './ProjectList.css';

interface ProjectListProps {
  className?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ className }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  
  // Extract all unique technologies from projects
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => techSet.add(tech));
      }
    });
    return Array.from(techSet).sort();
  }, []);
  
  // Toggle a filter on/off
  const toggleFilter = (tech: string) => {
    if (selectedFilters.includes(tech)) {
      // Remove the filter if already selected
      setSelectedFilters(selectedFilters.filter(filter => filter !== tech));
    } else {
      // Add the filter
      setSelectedFilters([...selectedFilters, tech]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters([]);
  };
  
  // Filter projects when selectedFilters changes
  useEffect(() => {
    if (selectedFilters.length === 0) {
      // Show all projects if no filters selected
      setFilteredProjects(projects);
    } else {
      // Show projects that have ANY of the selected technologies
      setFilteredProjects(
        projects.filter(project => 
          project.technologies && 
          selectedFilters.some(filter => project.technologies!.includes(filter))
        )
      );
    }
  }, [selectedFilters]);

  return (
    <div className={`project-list ${className || ''}`}>
      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter by Technology</h3>
          {selectedFilters.length > 0 && (
            <button 
              className="clear-filters-button"
              onClick={clearFilters}
              title="Clear all filters"
            >
              Clear All <FaTimes />
            </button>
          )}
        </div>
        
        <div className="filter-container">
          {allTechnologies.map(tech => (
            <button
              key={tech}
              className={`filter-button ${selectedFilters.includes(tech) ? 'active' : ''}`}
              onClick={() => toggleFilter(tech)}
              title={selectedFilters.includes(tech) ? `Remove ${tech} filter` : `Add ${tech} filter`}
            >
              <div className="filter-button-content">
                <TechIcon tech={tech} size="sm" showName={true} />
              </div>
            </button>
          ))}
        </div>
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
            <p>No projects found with the selected technologies.</p>
            <button className="reset-filters-button" onClick={clearFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;

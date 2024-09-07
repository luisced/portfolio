import React from "react";
import ProjectOverview from "../ProjectOverview/ProjectOverview";
import { projects } from "./ProjectData";
import "./Portfolio.css";

const Portfolio = () => {
	// Group projects by category using reduce
	const groupedProjects = projects.reduce((acc, project) => {
		const { projectCategory } = project;
		if (!acc[projectCategory]) {
			acc[projectCategory] = [];
		}
		acc[projectCategory].push(project);
		return acc;
	}, {});

	return (
		<div className="portfolio">
			{/* Dynamically render sections for each project category */}
			{Object.entries(groupedProjects).map(([category, categoryProjects]) => (
				<section key={category} id={`${category.toLowerCase()}-portfolio`}>
					<h2 className="portfolio-category">{category} Portfolio</h2>
					{categoryProjects.map((project) => (
						<div key={project.id} className="project-wrapper">
							<ProjectOverview
								projectNumber={project.id}
								title={project.title}
								role={project.role}
								description={project.description}
								category={project.category}
								images={project.images}
							/>
						</div>
					))}
				</section>
			))}
		</div>
	);
};

export default Portfolio;

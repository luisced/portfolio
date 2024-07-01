// src/components/Portfolio/Portfolio.js
import React from "react";
import ProjectOverview from "../ProjectOverview/ProjectOverview";
import { projects } from "./ProjectData";
import "./Portfolio.css";

const Portfolio = () => {
	return (
		<div className="portfolio">
			<section id="mobile-portfolio">
				<h2 className="portfolio-category">Mobile Portfolio</h2>
				{projects.map((project) => (
					<ProjectOverview
						key={project.id}
						projectNumber={project.id}
						title={project.title}
						role={project.role}
						description={project.description}
						category={project.category}
						images={project.images}
					/>
				))}
				<MobilePortfolioExperience />
			</section>
		</div>
	);
};

const MobilePortfolioExperience = () => {
	return <div className="mobile-experience">Hello</div>;
};

export default Portfolio;

import React, { useState, useEffect } from "react";
import ProjectOverview from "../ProjectOverview/ProjectOverview";
import { projects } from "./ProjectData";
import "./Portfolio.css";

const Portfolio = () => {
	const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
	const threshold = 0.5; // Change this value to trigger the transition earlier (0.5 = 50% of viewport height)

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const projectHeight = window.innerHeight;
			const offset = projectHeight * threshold;
			const newProjectIndex = Math.min(
				Math.floor((scrollPosition + offset) / projectHeight),
				projects.length - 1
			);
			setCurrentProjectIndex(newProjectIndex);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="portfolio">
			<section id="mobile-portfolio">
				<h2 className="portfolio-category">Mobile Portfolio</h2>
				{projects.map((project, index) => (
					<div
						key={project.id}
						className={`project-wrapper ${
							index === currentProjectIndex ? "visible" : "hidden"
						}`}
					>
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
		</div>
	);
};

export default Portfolio;

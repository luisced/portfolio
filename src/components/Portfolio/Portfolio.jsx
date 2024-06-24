// src/components/Portfolio.js
import React from "react";
import MobilePortfolio from "./MobilePortfolio/MobilePortfolio";
import ProjectOverview from "../ProjectOverview/ProjectOverview";
import "./Portfolio.css";

const Portfolio = () => {
	return (
		<div className="portfolio">
			<section id="mobile-portfolio">
				<h2>Mobile Portfolio</h2>
				<ProjectOverview
					projectNumber="01"
					title="FR Design system"
					role="Design system lead • Technical PDM"
					description="Multi brand e-commerce design system for websites and native mobile applications."
					category="DESIGN SYSTEM"
				/>
				<MobilePortfolio />
			</section>
		</div>
	);
};

export default Portfolio;

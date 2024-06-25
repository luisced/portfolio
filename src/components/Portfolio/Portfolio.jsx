// src/components/Portfolio.js
import React from "react";
import ProjectOverview from "../ProjectOverview/ProjectOverview";
import genesis1 from "../../assets/genesis/genesis1.png";
import genesis2 from "../../assets/genesis/genesis2.png";
import genesis3 from "../../assets/genesis/genesis3.png";
import genesis4 from "../../assets/genesis/genesis4.png";
import "./Portfolio.css";

const Portfolio = () => {
	const geneis = [
		{ src: genesis1, alt: "Genesis Dashboard", y: [-20, 20], x: [20, -20] },
		{ src: genesis2, alt: "Geneis Login", y: [20, -20], x: [-20, 20] },
		{ src: genesis3, alt: "Genesis Profile", y: [-20, 20], x: [20, -20] },
		{ src: genesis4, alt: "Genesis Chat", y: [20, -20], x: [-20, 20] },
	];

	return (
		<div className="portfolio">
			<section id="mobile-portfolio">
				<h2 className="portfolio-category">Mobile Portfolio</h2>
				<ProjectOverview
					projectNumber="01"
					title="Dermaware - Genesis"
					role="Development lead • Full-stack developer"
					description="Dermaware is a mobile application that allows users to track their skin health and receive personalized recommendations. Genesis is the first version of the app, which includes a skin health tracker, a integrated chat system, and a community forum. I led a team of 5 developers to build the app using SwiftUI and Flask."
					category="Mobile - iOS"
					images={geneis}
				/>
			</section>
		</div>
	);
};

export default Portfolio;

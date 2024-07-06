import React from "react";
import "./About.css";
import { FaArrowDown } from "react-icons/fa";
import Intro from "../Intro/Intro";
import Details from "../Details/Details";

const About = () => {
	return (
		<>
			<div className="app-window" id="app-window">
				<div className="header">
					<div className="menu-circle"></div>
					<div className="header-menu"></div>
				</div>
				<section className="about-content">
					<Intro />
					<Details />
				</section>
			</div>
			<ScrollCta />
		</>
	);
};

const ScrollCta = () => {
	const handleScrollToPortfolio = () => {
		const portfolioElement = document.getElementById("happy-mac");
		if (portfolioElement) {
			portfolioElement.scrollIntoView({ behavior: "smooth" });
		}
	};
	return (
		<div className="scroll-cta" onClick={handleScrollToPortfolio}>
			<FaArrowDown className="bounce" />
		</div>
	);
};

export default About;

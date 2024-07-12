import React from "react";
import "./About.css";
import { FaArrowDown } from "react-icons/fa";
import Intro from "../Intro/Intro";
import Details from "../Details/Details";
import Loading from "../Loading/Loading";
import Background from "../Background/Background";
const HappyMac = React.lazy(() => import("../HappyMac/HappyMac"));

const About = () => {
	return (
		<>
			<Background />
			<div className="app-window" id="app-window">
				<div className="header">
					<div className="menu-circle"></div>
					<div className="header-menu"></div>
				</div>
				<Intro />
				<Details />
			</div>
			<ScrollCta />
			<React.Suspense fallback={<Loading />}>
				<section id="happy-mac">
					<HappyMac />
				</section>
			</React.Suspense>
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

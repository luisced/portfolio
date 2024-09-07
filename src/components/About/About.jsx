import React, { lazy, Suspense } from "react";
import "./About.css";
import { FaArrowDown } from "react-icons/fa";
import Intro from "../Intro/Intro";
import Details from "../Details/Details";
import Background from "../Background/Background";
const Spline = lazy(() => import("@splinetool/react-spline"));

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
            <section className="happy-mac">
                <Suspense fallback={<div className="loading-spinner"></div>}>
			        <Spline scene="https://prod.spline.design/ydA5FKFEx0760sDJ/scene.splinecode" />
                </Suspense>
			</section>
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

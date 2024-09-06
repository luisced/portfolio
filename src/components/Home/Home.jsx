import React, { lazy, Suspense, useCallback, useMemo } from "react";
import Typical from "react-typical";
import { FaTerminal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Background from "../Background/Background";
import "./Home.css";

const Spline = lazy(() => import("@splinetool/react-spline"));

const Home = React.memo(({ presentationOpacity }) => {
	const navigate = useNavigate();

	const goToAbout = useCallback(() => {
		navigate("/about");
	}, [navigate]);

	const steps = useMemo(
		() => [" Backend Developer and Frontend Enthusiast.", 150],
		[]
	);

	return (
		<div className="home" id="home">
			<Background />
			<div className="presentation" style={{ opacity: presentationOpacity }}>
				<h1 className="name">Luis Cedillo Maldonado</h1>
				<h2 className="description">
					<FaTerminal />
					<Typical steps={steps} loop={1} wrapper="span" />
				</h2>
				<div className="glassbox">
					<p className="bio">
						My name is Luis Cedillo Maldonado, a backend developer and frontend
						enthusiast from Mexico City. I specialize in Backend solutions. Currently, I lead at the iOS
						Development Lab at Universidad Panamericana, where I mentor junior
						developers and manage agile projects. I am also pursuing a degree in
						Data Intelligence and Cybersecurity.
					</p>
				</div>
				<button className="about-me" onClick={goToAbout} aria-label="About Me">
					ABOUT ME
				</button>
			</div>
			<div className="spline-container">
				<Suspense fallback={<div className="loading-spinner"></div>}>
					<Spline scene="https://prod.spline.design/teYlWA7w9rFfaaLK/scene.splinecode" />
				</Suspense>
			</div>
		</div>
	);
});

export default Home;

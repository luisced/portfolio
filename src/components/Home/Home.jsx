import React, { useEffect, lazy, Suspense, useCallback, useMemo } from "react";
import Typical from "react-typical";
import { FaTerminal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Background from "../Background/Background"; // Import the Background component
import "./Home.css";

const Spline = lazy(() => import("@splinetool/react-spline"));

// Debounce function outside the component
const debounce = (func, delay) => {
	let inDebounce;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(context, args), delay);
	};
};

const Home = ({ presentationOpacity }) => {
	const navigate = useNavigate();

	const goToAbout = useCallback(() => {
		navigate("/about");
	}, [navigate]);

	useEffect(() => {
		const mouseBlob = document.getElementById("mouse-blob");
		const handleMouseMove = (e) => {
			const offsetX = mouseBlob.offsetWidth / 2;
			const offsetY = mouseBlob.offsetHeight / 2;
			mouseBlob.style.left = `${e.clientX - offsetX}px`;
			mouseBlob.style.top = `${e.clientY - offsetY}px`;
		};

		const debouncedHandleMouseMove = debounce(handleMouseMove, 10);

		document.addEventListener("mousemove", debouncedHandleMouseMove);

		return () => {
			document.removeEventListener("mousemove", debouncedHandleMouseMove);
		};
	}, []);

	const steps = useMemo(
		() => [" Backend Developer and Frontend Enthusiast.", 90],
		[]
	);

	return (
		<div className="home" id="home">
			<Background /> {/* Include the Background component */}
			<div className="presentation" style={{ opacity: presentationOpacity }}>
				<h1 className="name">Luis Cedillo Maldonado</h1>
				<h2 className="description">
					<FaTerminal />
					<Typical steps={steps} loop={1} wrapper="span" />
				</h2>
				<div className="glassbox">
					<p className="bio">
						I am Luis Cedillo Maldonado, a backend developer and frontend
						enthusiast from Mexico City. I specialize in custom CRM solutions
						and Twilio WhatsApp chatbots. Currently, I lead at the iOS
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
				<Suspense fallback={<div className="loading">Loading...</div>}>
					<Spline scene="https://prod.spline.design/teYlWA7w9rFfaaLK/scene.splinecode" />
				</Suspense>
			</div>
		</div>
	);
};

export default Home;

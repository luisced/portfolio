import React, { useEffect } from "react";
import Typical from "react-typical";
import { FaTerminal } from "react-icons/fa";
import "./Home.css";
import Spline from "@splinetool/react-spline";

const Home = ({ presentationOpacity }) => {
	const scrollToAbout = () => {
		document
			.getElementById("app-window")
			.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		const mouseBlob = document.getElementById("mouse-blob");
		const handleMouseMove = (e) => {
			const offsetX = mouseBlob.offsetWidth / 2;
			const offsetY = mouseBlob.offsetHeight / 2;
			mouseBlob.style.left = `${e.clientX - offsetX}px`;
			mouseBlob.style.top = `${e.clientY - offsetY}px`;
		};

		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div className="home" id="home">
			<div className="presentation" style={{ opacity: presentationOpacity }}>
				<h1 className="name">Luis Cedillo Maldonado</h1>
				<h2 className="description">
					<FaTerminal />
					<Typical
						steps={[" Backend Developer and Frontend Enthusiast.", 90]}
						loop={1}
						wrapper="span"
					/>
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
				<button
					className="about-me"
					onClick={scrollToAbout}
					aria-label="About Me"
				>
					ABOUT ME
				</button>
				<div className="noise-bg"></div>
				<div className="anim-blobs">
					<div className="blob-2"></div>
					<div className="blob-3"></div>
					<div className="blob-4"></div>
					<div className="blob-5" id="mouse-blob"></div>
					<div className="blob-6"></div>
					<div className="blob-7"></div>
				</div>
			</div>
			<div className="spline-container">
				<Spline scene="https://prod.spline.design/teYlWA7w9rFfaaLK/scene.splinecode" />
			</div>
		</div>
	);
};

export default Home;

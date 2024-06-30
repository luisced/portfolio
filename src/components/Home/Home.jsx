import React, { Suspense } from "react";
import Typical from "react-typical";
import { FaTerminal } from "react-icons/fa";
import "./Home.css";
import Spline from "@splinetool/react-spline";

const Home = ({ presentationOpacity }) => {
	const scrollToAbout = () => {
		document.getElementById("about").scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="home" id="home">
			<div className="presentation" style={{ opacity: presentationOpacity }}>
				<h1 className="name">Luis Cedillo Maldonado</h1>
				<h3 className="description">
					<FaTerminal />
					<Typical
						steps={[" Backend Developer and Frontend Enthusiast.", 90]}
						loop={1}
						wrapper="span"
					/>
				</h3>
				<p className="bio">
					I am Luis Cedillo Maldonado, a backend developer and frontend
					enthusiast from Mexico City. I specialize in custom CRM solutions and
					Twilio WhatsApp chatbots. Currently, I lead at the iOS Development Lab
					at Universidad Panamericana, where I mentor junior developers and
					manage agile projects. I am also pursuing a degree in Data
					Intelligence and Cybersecurity.
				</p>
				<button className="about-me" onClick={scrollToAbout}>
					ABOUT ME
				</button>
			</div>
			<div className="spline-container">
				<Suspense fallback={<div>Loading...</div>}>
					<Spline scene="https://prod.spline.design/teYlWA7w9rFfaaLK/scene.splinecode" />
				</Suspense>
			</div>
		</div>
	);
};

export default Home;

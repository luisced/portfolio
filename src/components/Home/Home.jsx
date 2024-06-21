import React from "react";
import Typical from "react-typical";
import { FaTerminal, FaGithub, FaLinkedin } from "react-icons/fa";
import Spline from "@splinetool/react-spline";
import "./Home.css";

const Home = () => {
	return (
		<div className="home">
			<div className="presentation">
				<h1 className="name">Luis Cedillo Maldonado</h1>
				<h3 className="description">
					<FaTerminal />
					<Typical
						steps={[" Backend Developer and Frontend Enthusiast.", 100]}
						loop={1}
						wrapper="span"
					/>
				</h3>
				<p className="bio">
					Luis Cedillo Maldonado, a backend developer and frontend enthusiast
					from Mexico City, specializes in custom CRM solutions and Twilio
					WhatsApp chatbots. Currently leading at iOS Development Lab,
					Universidad Panamericana, he mentors junior developers and manages
					agile projects. He's pursuing a degree in Data Intelligence and
					Cybersecurity.
				</p>

				<div className="social-icons">
					<a
						href="https://github.com/luisced"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaGithub />
					</a>
					<a
						href="https://linkedin.com/in/luisced"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaLinkedin />
					</a>
				</div>
			</div>
			<div className="spline-container">
				<Spline scene="https://prod.spline.design/dwWtMM1K2vIrJTSP/scene.splinecode" />
			</div>

			<div className="scroll-indicator">
				<span>&#x25BC;</span>
			</div>
		</div>
	);
};

export default Home;

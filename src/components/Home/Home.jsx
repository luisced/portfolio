import React from "react";
import Typical from "react-typical";
import { FaTerminal } from "react-icons/fa";
import Spline from "@splinetool/react-spline";
import "./Home.css";

const Home = ({ presentationOpacity }) => {
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
				<button
					className="about-me"
					role="button"
					onClick={() => (window.location.href = "#about")}
				>
					ABOUT ME
				</button>
			</div>
			<div className="spline-container">
				<Spline scene="https://prod.spline.design/dwWtMM1K2vIrJTSP/scene.splinecode" />
			</div>
		</div>
	);
};

export default Home;

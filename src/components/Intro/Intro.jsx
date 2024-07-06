import React from "react";
import profilePic from "../../assets/pfp.jpg";
import SocialLinks from "../SocialLinks/SocialLinks";
import "./Intro.css";

const Intro = () => (
	<div className="intro">
		<div className="intro-text">
			<h1>
				.about(<span className="highlight">luis</span>)
			</h1>
			<SocialLinks />
			<p className="experience-description">
				I am Luis Cedillo Maldonado, a backend developer and frontend enthusiast
				from Mexico City. I specialize in custom CRM solutions and Twilio
				WhatsApp chatbots. Currently, I lead at the iOS Development Lab at
				Universidad Panamericana, where I mentor junior developers and manage
				agile projects. I am also pursuing a degree in Data Intelligence and
				Cybersecurity.
			</p>
			<p>
				<br /># Development Leader @ iOS Development Lab
			</p>
		</div>
		<img src={profilePic} alt="Luis Cedillo" className="profile-pic" />
	</div>
);

export default Intro;

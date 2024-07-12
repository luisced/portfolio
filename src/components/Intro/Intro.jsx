import React from "react";
import profilePic from "../../assets/pfp.webp";
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
				I am a backend developer with experience in creating custom CRM
				solutions, implementing automated systems, and leading development
				teams. My work includes developing chatbots, managing iOS development
				projects, and designing scalable backend architectures. I have a strong
				foundation in Python, Flask, Django, and AWS, and I am passionate about
				improving operational efficiency and data accuracy.
			</p>
			<p>
				<br /># Development Leader @ iOS Development Lab
			</p>
		</div>
		<img
			src={profilePic}
			alt="Luis Cedillo"
			className="profile-pic"
			width="550"
			height="550"
		/>
	</div>
);

export default Intro;

import React from "react";
import "./About.css";
import { FaDownload } from "react-icons/fa";
import { PiLessThan, PiGreaterThan } from "react-icons/pi";

const About = () => {
	return (
		<div className="about">
			<div className="intro">
				<div className="intro-text">
					<h1>
						about(<span className="highlight">luis</span>)
					</h1>
					<div className="links">
						<a
							href="path-to-your-cv.pdf"
							target="_blank"
							rel="noopener noreferrer"
						>
							Download my CV <FaDownload />
						</a>
					</div>
					<p>
						Backend developer heavily influenced by Frontend development, Cloud
						Computing, and security. Addicted to coding, problem-solving, and{" "}
						<span className="highlight">learning new technologies</span>.
					</p>
					<p>
						<br /># Development Leader @ iOS Development Lab
					</p>
				</div>
			</div>
			<div className="details">
				<div className="section">
					<h2>Main Skills</h2>
					<ul>
						<li>Backend Development, Cloud Computing, System Security</li>
						<li>Frontend Development, App Design</li>
						<li>
							Python, Flask, Django, C++, Bash, Rust, Swift, JavaScript, React
						</li>
						<li>
							PostgreSQL, MySQL, SQLite, AWS, Docker, Kubernetes,
							Virtualization, Networking
						</li>
					</ul>
				</div>
				<div className="section">
					<h2>Experience</h2>
					<div className="experience-item">
						<h3>Development Leader @ iOS Development Lab</h3>
						<p>Universidad Panamericana, Current</p>
					</div>
					<div className="experience-item">
						<h3>Freelance Developer</h3>
						<p>
							Developed and deployed Twilio WhatsApp chatbot to automate Airbnb
							guest bookings
						</p>
					</div>
					<div className="experience-item">
						<h3>Backend Developer @ Zenco Mexico</h3>
						<p>
							Delivered custom CRM solutions using Python, Flask, MySQL, and AWS
						</p>
					</div>
				</div>
				<div className="section">
					<h2>Languages</h2>
					<ul>
						<li>Fluent: English, Spanish</li>
						<li>Intermediate: French</li>
					</ul>
				</div>
				<div className="section">
					<h2>Also busy with...</h2>
					<ul>
						<li>Coding new projects</li>
						<li>Playing video games</li>
						<li>Going to the Gym</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default About;

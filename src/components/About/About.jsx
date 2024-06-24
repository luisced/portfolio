import React from "react";
import "./About.css";
import { FaDownload, FaGithub, FaLinkedin } from "react-icons/fa";
import profilePic from "../../assets/pfp.jpg";

const About = () => {
	return (
		<div className="about">
			<div className="intro">
				<div className="intro-text">
					<h1>
						about(<span className="highlight">luis</span>)
					</h1>
					{/* <img src="../../assets/pfp.jpg" alt="Luis Cedillo Image" className="profile-pic" /> */}
					<div className="links">
						<a
							href="https://github.com/luisced"
							target="_blank"
							rel="noopener noreferrer"
							title="Check out my GitHub"
						>
							<FaGithub />
						</a>
						<a
							href="https://linkedin.com/in/luisced"
							target="_blank"
							rel="noopener noreferrer"
							title="Connect with me on LinkedIn"
						>
							<FaLinkedin />
						</a>
						<a
							href="./assets/Luis Cedillo Maldonado CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							title="Download my CV"
						>
							Download my CV <FaDownload />
						</a>
					</div>
					<p className="experience-description">
						I am Luis Cedillo Maldonado, a backend developer and frontend
						enthusiast from Mexico City. I specialize in custom CRM solutions
						and Twilio WhatsApp chatbots. Currently, I lead at the iOS
						Development Lab at Universidad Panamericana, where I mentor junior
						developers and manage agile projects. I am also pursuing a degree in
						Data Intelligence and Cybersecurity.
					</p>
					<p>
						<br /># Development Leader @ iOS Development Lab
					</p>
				</div>
				<img
					src={profilePic}
					alt="Luis Cedillo Image"
					className="profile-pic"
				/>
			</div>
			<div className="details">
				<section>
					<h2>Main Skills</h2>
					<ul className="skills-grid">
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
				</section>
				<section className="main-skills">
					<h2>Experience</h2>
					<div className="experience-item">
						<h3>Development Leader @ iOS Development Lab (2023 - Current)</h3>
						<p>
							Lead development teams and created mobile apps with SwiftUI and
							Django
						</p>
					</div>
					<div className="experience-item">
						<h3>Freelance Developer (Jun 2022 - Nov 2022)</h3>
						<p>
							Developed and deployed Twilio WhatsApp chatbot to automate Airbnb
							guest bookings
						</p>
					</div>
					<div className="experience-item">
						<h3>Backend Developer @ Zenco Mexico (2021-2022)</h3>
						<p>
							Delivered custom CRM solutions using Python, Flask, MySQL, and AWS
						</p>
					</div>
				</section>
				<div className="languages-and-busy">
					<section>
						<h2>Languages</h2>
						<ul>
							<li>Fluent: English, Spanish</li>
							<li>Intermediate: French</li>
						</ul>
					</section>
					<section>
						<h2>Also busy with...</h2>
						<ul>
							<li>Coding new projects</li>
							<li>Playing video games</li>
							<li>Going to the Gym</li>
						</ul>
					</section>
					<section>
						<h2>Education</h2>
						<ul>
							<li>
								Universidad Panamericana, Bachelor's in Data Intelligence and
								Cybersecurity, Current
							</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
};

export default About;

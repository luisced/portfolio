import React, { useEffect } from "react";
import "./About.css";
import { FaDownload, FaGithub, FaLinkedin, FaArrowDown } from "react-icons/fa";
import profilePic from "../../assets/pfp.jpg";
import cv from "../../assets/Luis Cedillo Maldonado CV.pdf";

const About = () => {
	return (
		<>
			<div className="app-window" id="app-window">
				<div className="header">
					<div className="menu-circle"></div>
					<div className="header-menu"></div>
				</div>
				<section className="about-content">
					<Intro />
					<Details />
				</section>
			</div>
			<ScrollCta />
		</>
	);
};

const ScrollCta = () => {
	const handleScrollToPortfolio = () => {
		const portfolioElement = document.getElementById("happy-mac");
		if (portfolioElement) {
			portfolioElement.scrollIntoView({ behavior: "smooth" });
		}
	};
	return (
		<div className="scroll-cta" onClick={handleScrollToPortfolio}>
			<FaArrowDown className="bounce" />
		</div>
	);
};

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

const SocialLinks = () => {
	const handleDownloadCV = () => {
		const link = document.createElement("a");
		link.href = cv;
		link.download = "Luis_Cedillo_Maldonado_CV.pdf";
		link.click();
	};
	return (
		<div className="links">
			{socialLinks.map(({ href, icon: Icon, title }) => (
				<a
					key={href}
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					title={title}
				>
					<Icon />
				</a>
			))}
			<button
				onClick={handleDownloadCV}
				title="Download my CV"
				className="download-cv"
			>
				Download my CV <FaDownload />
			</button>
		</div>
	);
};

const Details = () => (
	<div className="details">
		<div className="skills-container">
			<Skills title="Backend Skills" skills={backendSkills} />
			<Skills title="Frontend Skills" skills={frontendSkills} />
			<Skills
				title="Databases & Cloud Skills"
				skills={databasesAndCloudSkills}
			/>
		</div>
		<Experience />
		<ExtraInfo />
	</div>
);

const Skills = ({ title, skills }) => {
	useEffect(() => {
		const bars = document.querySelectorAll(".bar");

		bars.forEach((bar) => {
			const { color, delay } = JSON.parse(bar.getAttribute("data-bar"));
			const percentage = bar.querySelector(".pct").textContent;

			setTimeout(() => {
				bar.style.background = color; // Apply the gradient color here
				bar.style.width = percentage;
			}, delay);
		});
	}, []);

	return (
		<div className="skills-card">
			<h2>{title}</h2>
			<ul id="skills">
				{skills.map((skill, index) => (
					<li key={index}>
						{skill.name}
						<div className="bar_container">
							<span
								className="bar"
								data-bar={JSON.stringify({
									color: skill.color,
									delay: skill.delay,
								})}
							>
								<span className="pct">{skill.percent}%</span>
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

const Experience = () => (
	<section className="main-skills">
		<h2>Experience</h2>
		{experiences.map(({ role, company, period, description }) => (
			<div key={role} className="experience-item">
				<h3>{`${role} @ ${company} (${period})`}</h3>
				<p>{description}</p>
			</div>
		))}
	</section>
);

const ExtraInfo = () => (
	<div className="languages-and-busy">
		<section>
			<h2>Languages</h2>
			<ul>
				{languages.map((language, index) => (
					<li key={index}>{language}</li>
				))}
			</ul>
		</section>
		<section>
			<h2>Also Busy With</h2>
			<ul>
				{busyWith.map((activity, index) => (
					<li key={index}>{activity}</li>
				))}
			</ul>
		</section>
		<section>
			<h2>Education</h2>
			<ul>
				{education.map((edu, index) => (
					<li key={index}>{edu}</li>
				))}
			</ul>
		</section>
	</div>
);

const socialLinks = [
	{
		href: "https://github.com/luisced",
		icon: FaGithub,
		title: "Check out my GitHub",
	},
	{
		href: "https://linkedin.com/in/luisced",
		icon: FaLinkedin,
		title: "Connect with me on LinkedIn",
	},
];
const backendSkills = [
	{
		name: "Python",
		percent: 90,
		color:
			"linear-gradient(90deg, rgba(36,107,176,1) 26%, rgba(20,184,218,1) 59%)",
		delay: 0,
	},
	{
		name: "C++",
		percent: 50,
		color:
			"linear-gradient(90deg, rgba(180,108,215,1) 44%, rgba(20,117,218,1) 81%)",
		delay: 200,
	},
	{
		name: "Rust",
		percent: 65,
		color:
			"linear-gradient(90deg, rgba(250,128,114,1) 26%, rgba(255,99,71,1) 59%)",
		delay: 400,
	},
	{
		name: "Bash",
		percent: 40,
		color:
			"linear-gradient(90deg, rgba(46,139,87,1) 26%, rgba(60,179,113,1) 59%)",
		delay: 600,
	},
];

const frontendSkills = [
	{
		name: "JavaScript",
		percent: 65,
		color:
			"linear-gradient(90deg, rgba(240,219,79,1) 26%, rgba(255,215,0,1) 59%)",
		delay: 0,
	},
	{
		name: "React",
		percent: 60,
		color:
			"linear-gradient(90deg, rgba(97,219,251,1) 26%, rgba(0,191,255,1) 59%)",
		delay: 200,
	},
	{
		name: "CSS",
		percent: 50,
		color:
			"linear-gradient(90deg, rgba(38,77,228,1) 26%, rgba(65,105,225,1) 59%)",
		delay: 400,
	},
	{
		name: "Swift",
		percent: 75,
		color:
			"linear-gradient(90deg, rgba(240,81,56,1) 26%, rgba(255,99,71,1) 59%)",
		delay: 600,
	},
];

const databasesAndCloudSkills = [
	{
		name: "PostgreSQL",
		percent: 85,
		color:
			"linear-gradient(90deg, rgba(51,103,145,1) 26%, rgba(30,144,255,1) 59%)",
		delay: 0,
	},
	{
		name: "MySQL",
		percent: 80,
		color:
			"linear-gradient(90deg, rgba(0,117,143,1) 26%, rgba(0,191,255,1) 59%)",
		delay: 200,
	},
	{
		name: "AWS",
		percent: 65,
		color:
			"linear-gradient(90deg, rgba(255,153,0,1) 26%, rgba(255,165,0,1) 59%)",
		delay: 400,
	},
	{
		name: "Docker",
		percent: 85,
		color:
			"linear-gradient(90deg, rgba(13,183,237,1) 26%, rgba(30,144,255,1) 59%)",
		delay: 600,
	},
];

const experiences = [
	{
		role: "Development Leader",
		company: "iOS Development Lab",
		period: "2023 - Current",
		description:
			"Lead development teams and created mobile apps with SwiftUI and Django",
	},
	{
		role: "Freelance Developer",
		company: "",
		period: "Jun 2022 - Nov 2022",
		description:
			"Developed and deployed Twilio WhatsApp chatbot to automate Airbnb guest bookings",
	},
	{
		role: "Backend Developer",
		company: "Zenco Mexico",
		period: "2021-2022",
		description:
			"Delivered custom CRM solutions using Python, Flask, MySQL, and AWS",
	},
];

const languages = ["Fluent: English, Spanish", "Intermediate: French"];

const busyWith = [
	"Coding new projects",
	"Playing video games",
	"Going to the Gym",
];

const education = [
	"Universidad Panamericana, Bachelor's in Data Intelligence and Cybersecurity, Current - 2025 (Expected)",
	"AWS Academy Graduate - AWS Academy Cloud Foundations - 2023",
	"App Development with Swift Associate - 2023",
];

export default About;

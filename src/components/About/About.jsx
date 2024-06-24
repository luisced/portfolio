import React from "react";
import "./About.css";
import { FaDownload, FaGithub, FaLinkedin } from "react-icons/fa";
import profilePic from "../../assets/pfp.jpg";
import cv from "../../assets/Luis Cedillo Maldonado CV.pdf";

const About = () => {
	return (
		<section className="about">
			<Intro />
			<Details />
		</section>
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

const SocialLinks = () => (
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
		<a
			href={cv}
			download="Luis_Cedillo_Maldonado_CV.pdf"
			title="Download my CV"
		>
			Download my CV <FaDownload />
		</a>
	</div>
);

const Details = () => (
	<div className="details">
		<Skills />
		<Experience />
		<LanguagesAndBusy />
	</div>
);

const Skills = () => (
	<section>
		<h2>Main Skills</h2>
		<ul className="skills-grid">
			{skills.map((skill, index) => (
				<li key={index}>{skill}</li>
			))}
		</ul>
	</section>
);

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

const LanguagesAndBusy = () => (
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
			<h2>Also busy with...</h2>
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

const skills = [
	"Backend Development, Cloud Computing, System Security",
	"Frontend Development, App Design",
	"Python, Flask, Django, C++, Bash, Rust, Swift, JavaScript, React",
	"PostgreSQL, MySQL, SQLite, AWS, Docker, Kubernetes, Virtualization, Networking",
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
	"Universidad Panamericana, Bachelor's in Data Intelligence and Cybersecurity, Current",
];

export default About;

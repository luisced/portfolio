import React from "react";
import "./ExtraInfo.css";

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

export default ExtraInfo;

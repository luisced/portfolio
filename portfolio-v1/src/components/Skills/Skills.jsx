import React, { useEffect } from "react";
import "./Skills.css";

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

export default Skills;

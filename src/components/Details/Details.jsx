import React from "react";
import Skills from "../Skills/Skills";
import Timeline from "../Timeline/Timeline";
import ExtraInfo from "../ExtraInfo/ExtraInfo";
import {
	backendSkills,
	frontendSkills,
	databasesAndCloudSkills,
	timelineItems,
} from "./DetailsData";
import "./Details.css";

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
		<Timeline items={timelineItems} />
		<ExtraInfo />
	</div>
);

export default Details;

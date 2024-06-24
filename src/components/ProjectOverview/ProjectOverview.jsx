// src/components/ProjectOverview/ProjectOverview.js
import React from "react";
import PropTypes from "prop-types";
import "./ProjectOverview.css";

const ProjectOverview = ({
	projectNumber,
	title,
	role,
	description,
	category,
}) => {
	return (
		<div className="project-overview">
			<div className="project-header">
				<h3>{projectNumber}</h3>
				<h2>{title}</h2>
			</div>
			<div className="project-details">
				<h4>{role}</h4>
				<p>{description}</p>
			</div>
			<div className="project-category">
				<h4>{category}</h4>
			</div>
		</div>
	);
};

ProjectOverview.propTypes = {
	projectNumber: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	category: PropTypes.string.isRequired,
};

export default ProjectOverview;

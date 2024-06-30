import React from "react";
import PropTypes from "prop-types";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import "./ProjectOverview.css";

const defaultImages = [
	// Image 1
	{
		y: [0, -130],
		x: [0, 0],
		speed: 100,
	},
	// Image 2
	{
		y: [20, -135],
		x: [0, 0],
		speed: 90,
	},
	// Image 3
	{
		y: [50, -100],
		x: [0, 0],
		speed: -30,
	},
	// Image 4
	{
		y: [0, -100],
		x: [0, 0],
		speed: -20,
	},
];

const ProjectOverview = ({
	projectNumber,
	title,
	role,
	description,
	category,
	images,
}) => {
	// Merge images with default properties
	const adjustedImages = images.map((image, index) => ({
		...defaultImages[index % defaultImages.length],
		...image,
	}));

	return (
		<ParallaxProvider>
			<div className="project-overview">
				<div className="project-content">
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
				<div className="project-images">
					{adjustedImages.map((image, index) => (
						<Parallax
							key={index}
							className="parallax-image"
							translateX={image.x}
							translateY={image.y}
							speed={image.speed}
						>
							<img src={image.src} alt={image.alt} />
						</Parallax>
					))}
				</div>
			</div>
		</ParallaxProvider>
	);
};

ProjectOverview.propTypes = {
	projectNumber: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	category: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(
		PropTypes.shape({
			src: PropTypes.string.isRequired,
			alt: PropTypes.string.isRequired,
			y: PropTypes.arrayOf(PropTypes.number),
			x: PropTypes.arrayOf(PropTypes.number),
			speed: PropTypes.number,
		})
	).isRequired,
};

export default ProjectOverview;

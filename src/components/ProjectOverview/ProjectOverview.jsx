import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ProjectOverview.css";

const defaultImages = [
	// Image 1
	{
		y: [0, -210],
		x: [0, 0],
		speed: 20,
	},
	// Image 2
	{
		y: [50, -200],
		x: [0, 0],
		speed: 20,
	},
	// Image 3
	{
		y: [90, -210],
		x: [0, 0],
		speed: 5,
	},
	// Image 4
	{
		y: [100, -190],
		x: [0, 0],
		speed: 9,
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
	const [isPortrait, setIsPortrait] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsPortrait(
				window.innerWidth <= 1024 && window.innerHeight > window.innerWidth
			);
		};

		handleResize(); // Check the initial window size
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const adjustedImages = images.map((image, index) => ({
		...defaultImages[index % defaultImages.length],
		...image,
	}));

	const responsive = {
		superLargeDesktop: {
			breakpoint: { max: 4000, min: 3000 },
			items: 5,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 2,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};

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
					{isPortrait && (
						<div className="carousel-container">
							<Carousel responsive={responsive}>
								{adjustedImages.map((image, index) => (
									<div key={index}>
										<img src={image.src} alt={image.alt} />
									</div>
								))}
							</Carousel>
						</div>
					)}
				</div>
				{!isPortrait && (
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
				)}
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

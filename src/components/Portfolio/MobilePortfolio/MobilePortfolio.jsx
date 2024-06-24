// src/components/MobilePortfolio.js
import React from "react";
import { Parallax } from "react-scroll-parallax";
import genesis1 from "../../../assets/genesis/genesis1.png";
import genesis2 from "../../../assets/genesis/genesis2.png";
import "./MobilePortfolio.css";

const MobilePortfolio = () => {
	const parallaxImages = [
		{ src: genesis1, alt: "Mobile 1", y: [-20, 20], x: [20, -20] },
		{ src: genesis2, alt: "Mobile 2", y: [20, -20], x: [-20, 20] },
	];

	return (
		<div className="mobile-portfolio">
			{parallaxImages.map((image, index) => (
				<Parallax
					key={index}
					className="parallax-image"
					tagOuter="figure"
					translateX={image.x}
					translateY={image.y}
				>
					<img src={image.src} alt={image.alt} />
				</Parallax>
			))}
		</div>
	);
};

export default MobilePortfolio;

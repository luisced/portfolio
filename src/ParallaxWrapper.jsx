import React from "react";
import { ParallaxProvider, ParallaxBanner } from "react-scroll-parallax";

const ParallaxWrapper = ({ children, imageUrl, strength }) => {
	return (
		<ParallaxProvider>
			<ParallaxBanner
				layers={[
					{
						image: imageUrl,
						amount: strength,
					},
				]}
				style={{ height: "100vh" }}
			>
				{children}
			</ParallaxBanner>
		</ParallaxProvider>
	);
};

export default ParallaxWrapper;

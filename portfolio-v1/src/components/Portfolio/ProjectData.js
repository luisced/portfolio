// src/data/projectData.js
import genesis1 from "../../assets/genesis/genesis1.webp";
import genesis2 from "../../assets/genesis/genesis2.webp";
import genesis3 from "../../assets/genesis/genesis3.webp";
import genesis4 from "../../assets/genesis/genesis4.webp";

import homecare1 from "../../assets/homecare/homecare1.webp";
import homecare2 from "../../assets/homecare/homecare2.webp";
import homecare3 from "../../assets/homecare/homecare3.webp";
import homecare4 from "../../assets/homecare/homecare4.webp";

import oxxocorner1 from "../../assets/oxxocorner/oxxocorner1.webp";
import oxxocorner2 from "../../assets/oxxocorner/oxxocorner2.webp";
import oxxocorner3 from "../../assets/oxxocorner/oxxocorner3.webp";
import oxxocorner4 from "../../assets/oxxocorner/oxxocorner4.webp";

export const projects = [
	{
		id: "01",
		title: "Dermaware - Genesis",
		role: "Development lead • Full-stack developer",
		description:
			"Dermaware is a mobile application that allows users to track their skin health and receive personalized recommendations. Genesis is the first version of the app, which includes a skin health tracker, an integrated chat system, and a community forum. I led a team of 5 developers to build the app using SwiftUI and Flask.",
		category: "Mobile - iOS",
		images: [
			{
				src: genesis1,
				alt: "Genesis Dashboard",
			},
			{
				src: genesis4,
				alt: "Genesis Chat",
			},
			{
				src: genesis3,
				alt: "Genesis Profile",
			},
			{
				src: genesis2,
				alt: "Genesis Login",
			},
		],
	},
	{
		id: "02",
		title: "Homecare - Nemesis",
		role: "Team lead • Backend developer",
		description:
			"Homecare is a mobile a applications that allows users to measure their energy consumption through computasional vision in order to provide personalized recommendations. Nemesis is the first version of the app, which includes a energy consumption tracker, and a generative AI. I led a team of 5 developers to build the app using SwiftUI and Django.",
		category: "Mobile - iOS",
		images: [
			{
				src: homecare1,
				alt: "homecare Dashboard",
			},
			{
				src: homecare2,
				alt: "homecare Energy Chart",
			},
			{
				src: homecare3,
				alt: "homecare Room Energy Consumption",
			},
			{
				src: homecare4,
				alt: "Homecare profile settings",
			},
		],
	},
	{
		id: "03",
		title: "Oxxo Corner - Femsa",
		role: "Product Owner • Full-stack developer",
		description:
			"Oxxo Corner is a mobile application that allows users to interact with Oxxo stores in a new way, by providing an augmented reality experience in order to receive personalized recommendations. This is the first version of the app, which includes a AR experience, a image filtering by generative AI, and a community forum. I led a team of 4 developers to build the app using SwiftUI and Flask.",
		category: "Mobile - iOS",
		images: [
			{
				src: oxxocorner1,
				alt: "Genesis Dashboard",
			},
			{
				src: oxxocorner2,
				alt: "Genesis Chat",
			},
			{
				src: oxxocorner3,
				alt: "Genesis Profile",
			},
			{
				src: oxxocorner4,
				alt: "Genesis Login",
			},
		],
	},
];

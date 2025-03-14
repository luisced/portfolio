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

import test from "../../assets/test/phone.jpg";

export const projects = [
	{
		id: "01",
		title: "Dermaware - Genesis",
		role: "Development lead • Full-stack developer",
		description:
			"Dermaware is a mobile application that allows users to track their skin health and receive personalized recommendations.",
		category: "Mobile - iOS",
		projectCategory: "Mobile",
		images: [
			{ src: genesis1, alt: "Genesis Dashboard" , platform: "Mobile"},
			{ src: genesis4, alt: "Genesis Chat" , platform: "Mobile"},
			{ src: genesis3, alt: "Genesis Profile", platform: "Mobile"},
			{ src: genesis2, alt: "Genesis Login", platform: "Mobile" },
		],
	},
	{
		id: "02",
		title: "Homecare - Nemesis",
		role: "Team lead • Backend developer",
		description:
			"Homecare is a mobile application that allows users to measure their energy consumption through computer vision.",
		category: "Mobile - iOS",
		projectCategory: "Mobile",
		images: [
			{ src: homecare1, alt: "Homecare Dashboard" , platform: "Mobile"},
			{ src: homecare2, alt: "Homecare Energy Chart" , platform: "Mobile"},
			{ src: homecare3, alt: "Homecare Room Energy Consumption" , platform: "Mobile"},
			{ src: homecare4, alt: "Homecare Profile Settings" , platform: "Mobile"},
		],
	},
	{
		id: "03",
		title: "Oxxo Corner - Femsa",
		role: "Product Owner • Full-stack developer",
		description:
			"Oxxo Corner is a mobile application that allows users to interact with Oxxo stores using augmented reality.",
		category: "Mobile - iOS",
		projectCategory: "Mobile",
		images: [
			{ src: oxxocorner1, alt: "Oxxo Corner Dashboard" , platform: "Mobile"},
			{ src: oxxocorner2, alt: "Oxxo Corner AR" , platform: "Mobile"},
			{ src: oxxocorner3, alt: "Oxxo Corner Profile" , platform: "Mobile"},
			{ src: oxxocorner4, alt: "Oxxo Corner Login" , platform: "Mobile"},
		],
	},
    {
		id: "04",
		title: "Stackup - Nyx",
		role: "Team lead • Backend Developer",
		description:
			"Sackup is a mobile application made for Marriot hotels that allows hotel staff to unify platforms like Expedia, Booking, Pricetravel, etc. in one place.",
		category: "Web - FastAPI",
		projectCategory: "Web",
		images: [
			{ src: test, alt: "Oxxo Corner Dashboard" , platform: "Desktop"},
			{ src: test, alt: "Oxxo Corner AR" , platform: "Desktop"},
			{ src: test, alt: "Oxxo Corner Profile" , platform: "Desktop"},
			{ src: test, alt: "Oxxo Corner Login" , platform: "Desktop"},
		],
	},
    {
        id: "05",
        title: "Phoenix - UP",
        role: "Development lead • Full-stack developer",
        description:
            "Phoenix is a cross-platform app for UP that allows students to check their grades, schedules, maps and more.",
        category: "Mobile/Web - iOS/Rust",
        projectCategory: "Web",
        images: [
            { src: test, alt: "Oxxo Corner Dashboard" , platform: "Desktop"},
            { src: test, alt: "Oxxo Corner AR" , platform: "Desktop"},
            { src: test, alt: "Oxxo Corner Profile" , platform: "Desktop"},
            { src: test, alt: "Oxxo Corner Login" , platform: "Desktop"},
        ],
    }

];

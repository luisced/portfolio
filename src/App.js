// File: App.js
import React, { useEffect, useState } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import HappyMac from "./components/HappyMac/HappyMac";
import HelloAnimation from "./components/Hello/HelloAnimation";
import "./App.css";

function App() {
	const [background] = useState("--color-background");
	const [presentationOpacity, setPresentationOpacity] = useState(1);
	const [progress] = useState(0);

	const handleScroll = () => {
		const homeElement = document.getElementById("home");
		const homeHeight = homeElement.clientHeight;
		const scrollPosition = window.scrollY;

		if (scrollPosition < homeHeight && progress === 0) {
			const opacity = 1 - (scrollPosition / homeHeight) * 2;
			setPresentationOpacity(opacity);
		} else {
			setPresentationOpacity(0);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [progress]);

	useEffect(() => {
		document.body.style.backgroundColor = `var(${background})`;
	}, [background]);

	return (
		<div className="App">
			<Navbar />
			<main>
				<div id="home">
					<Home presentationOpacity={presentationOpacity} />
				</div>
				<div className="transition"></div>
				<HappyMac />
				<HelloAnimation />

				<About />
			</main>
		</div>
	);
}

export default App;

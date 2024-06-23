// File: App.js
import React, { useEffect, useState } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import HappyMac from "./components/HappyMac/HappyMac";
import HelloAnimation from "./components/Hello/HelloAnimation";
import BackgroundTransition from "./components/BackgroundTransition/BackgroundTransition";

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
				<BackgroundTransition
					gradient="linear-gradient(
	  to bottom,
	  #222,
	  #dcf7ff)"
				/>
				<HappyMac />
				<BackgroundTransition gradient="linear-gradient(to bottom, #dcf7ff, #ffffff)" />

				<HelloAnimation />

				<About />
			</main>
		</div>
	);
}

export default App;

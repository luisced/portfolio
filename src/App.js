// App.js

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Spline from "@splinetool/react-spline";
import "./App.css";

function App() {
	const [background, setBackground] = useState("--color-background");

	const handleScroll = () => {
		const homeHeight = document.getElementById("home").clientHeight;
		const scrollPosition = window.scrollY;
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		document.body.style.backgroundColor = `var(${background})`;
	}, [background]);

	return (
		<div className="App">
			<Navbar />
			<main>
				<div id="home">
					<Home />
				</div>
				<div className="transition"></div>
				<Spline scene="https://prod.spline.design/gh5W8uTjkvs-oVuN/scene.splinecode" />
				<About />
			</main>
		</div>
	);
}

export default App;

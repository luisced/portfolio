import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import HappyMac from "./components/HappyMac/HappyMac";
import HelloAnimation from "./components/Hello/HelloAnimation";
import BackgroundTransition from "./components/BackgroundTransition/BackgroundTransition";
import Portfolio from "./components/Portfolio/Portfolio";

import "./App.css";

function App() {
	const [presentationOpacity, setPresentationOpacity] = useState(1);

	const handleScroll = useCallback(() => {
		const homeElement = document.getElementById("home");
		if (homeElement) {
			const homeHeight = homeElement.clientHeight;
			const scrollPosition = window.scrollY;
			const opacity =
				scrollPosition < homeHeight ? 1 - (scrollPosition / homeHeight) * 2 : 0;
			setPresentationOpacity(opacity);
		}
	}, []);

	useEffect(() => {
		const handleScrollThrottled = throttle(handleScroll, 100);
		window.addEventListener("scroll", handleScrollThrottled);
		return () => {
			window.removeEventListener("scroll", handleScrollThrottled);
		};
	}, [handleScroll]);

	return (
		<ParallaxProvider>
			<Router>
				<div className="App">
					<Navbar />
					<Routes>
						<Route
							path="/"
							element={
								<main>
									<section id="home">
										<Home presentationOpacity={presentationOpacity} />
									</section>
									<section id="about">
										<About />
									</section>
									<BackgroundTransition gradient="linear-gradient(to bottom, #222, #dcf7ff)" />
									<section id="happy-mac">
										<HappyMac />
									</section>
								</main>
							}
						/>
						<Route path="/portfolio" element={<Portfolio />} />
					</Routes>
				</div>
			</Router>
		</ParallaxProvider>
	);
}

function throttle(func, limit) {
	let lastFunc;
	let lastRan;
	return function () {
		const context = this;
		const args = arguments;
		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(function () {
				if (Date.now() - lastRan >= limit) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, limit - (Date.now() - lastRan));
		}
	};
}

export default App;

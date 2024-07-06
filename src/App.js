import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import HappyMac from "./components/HappyMac/HappyMac";
import BackgroundTransition from "./components/BackgroundTransition/BackgroundTransition";
import Portfolio from "./components/Portfolio/Portfolio";

import "./App.css";

function App() {
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
										<Home />
									</section>
									<section id="about">
										<About />
									</section>
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

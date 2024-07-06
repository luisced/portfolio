import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import HappyMac from "./components/HappyMac/HappyMac";
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

export default App;

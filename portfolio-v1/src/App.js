import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Portfolio from "./components/Portfolio/Portfolio";
import Contact from "./components/Contact/Contact";
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
								</main>
							}
						/>
						<Route path="/about" element={<About />} />
						<Route path="/portfolio" element={<Portfolio />} />
						<Route path="/contact" element={<Contact />} />
					</Routes>
				</div>
			</Router>
		</ParallaxProvider>
	);
}

export default App;

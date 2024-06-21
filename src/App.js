import React from "react";
import ParallaxWrapper from "./ParallaxWrapper";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
// import Ideas from "./components/Ideas";
// import CV from "./components/CV";
// import Backend from "./components/Backend";
// import Web from "./components/Web";
// import Mobile from "./components/Mobile";
// import Contact from "./components/Contact";

function App() {
	return (
		<div className="App">
			<Navbar />
			<main>
				<Home />

				<About />
			</main>
		</div>
	);
}

export default App;

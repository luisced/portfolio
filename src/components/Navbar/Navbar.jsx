import React from "react";
import "./Navbar.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Navbar = () => (
	<nav className="navbar">
		<ul className="navbar-links">
			<li>
				<a href="#home">.home()</a>
			</li>
			<li>
				<a href="#about">.about()</a>
			</li>
			<li>
				<a href="#portfolio">.portfolio()</a>
			</li>
			<li>
				<a href="#contact">.contact()</a>
			</li>
			<li className="navbar-contact">
				<a href="https://github.com/luisced">
					<FaGithub className="icon" />
				</a>
			</li>
			<li className="navbar-contact">
				<a href="https://www.linkedin.com/in/luisced/">
					<FaLinkedin className="icon" />
				</a>
			</li>
		</ul>
	</nav>
);

export default Navbar;

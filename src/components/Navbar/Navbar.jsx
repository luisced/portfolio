import React, { useState } from "react";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleNavbar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			{isOpen && <div className="overlay" onClick={toggleNavbar}></div>}
			<nav className="navbar">
				<div className="hamburger" onClick={toggleNavbar}>
					{isOpen ? <FaTimes /> : <FaBars />}
				</div>
				<ul className={`navbar-links ${isOpen ? "active" : ""}`}>
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
				</ul>
			</nav>
		</>
	);
};

export default Navbar;

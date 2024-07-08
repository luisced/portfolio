import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [linkColor, setLinkColor] = useState("var(--color-text)");
	const [iconColorClass, setIconColorClass] = useState("");

	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/portfolio") {
			setLinkColor("var(--color-secondary-text)");
			setIconColorClass("black-icon");
		} else {
			setLinkColor("var(--color-text)"); // Default color
			setIconColorClass("");
		}
	}, [location.pathname]);

	const toggleNavbar = () => {
		setLinkColor("var(--color-text)");
		setIsOpen((prev) => !prev);
	};

	return (
		<>
			{isOpen && <div className="overlay" onClick={toggleNavbar}></div>}
			<nav className="navbar">
				<div
					className={`hamburger ${iconColorClass}`}
					onClick={toggleNavbar}
					aria-label={isOpen ? "Close menu" : "Open menu"}
				>
					{isOpen ? <FaTimes /> : <FaBars />}
				</div>
				<ul className={`navbar-links ${isOpen ? "active" : ""}`}>
					<li>
						<a href="/#home" style={{ color: linkColor }}>
							.home()
						</a>
					</li>
					<li>
						<a href="/portfolio" style={{ color: linkColor }}>
							.portfolio()
						</a>
					</li>
					<li>
						<a href="#contact" style={{ color: linkColor }}>
							.contact()
						</a>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [linkClass, setLinkClass] = useState("default-link");
	const [iconColorClass, setIconColorClass] = useState("");

	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/portfolio") {
			setLinkClass("portfolio-link");
			setIconColorClass("black-icon");
		} else {
			setLinkClass("default-link");
			setIconColorClass("");
		}
	}, [location.pathname]);

	const toggleNavbar = () => {
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
						<a href="/#home" className={linkClass}>
							.home()
						</a>
					</li>
					<li>
						<a href="/about" className={linkClass}>
							.about()
						</a>
					</li>
					<li>
						<a href="/portfolio" className={linkClass}>
							.portfolio()
						</a>
					</li>
					<li>
						<a href="/contact" className={linkClass}>
							.contact()
						</a>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default Navbar;

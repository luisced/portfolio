import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("");

	const toggleNavbar = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const sections = document.querySelectorAll("section");
		const options = {
			threshold: 0.7,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveSection(entry.target.id);
				}
			});
		}, options);

		sections.forEach((section) => {
			observer.observe(section);
		});

		return () => {
			sections.forEach((section) => {
				observer.unobserve(section);
			});
		};
	}, []);

	return (
		<>
			{isOpen && <div className="overlay" onClick={toggleNavbar}></div>}
			<nav className="navbar">
				<div className="hamburger" onClick={toggleNavbar}>
					{isOpen ? <FaTimes /> : <FaBars />}
				</div>
				<ul className={`navbar-links ${isOpen ? "active" : ""}`}>
					<li>
						<a
							href="/#home"
							className={activeSection === "home" ? "active-link" : ""}
						>
							.home()
						</a>
					</li>
					<li>
						<a
							href="/#about"
							className={activeSection === "about" ? "active-link" : ""}
						>
							.about()
						</a>
					</li>
					<li>
						<a
							href="/portfolio"
							className={activeSection === "portfolio" ? "active-link" : ""}
						>
							.portfolio()
						</a>
					</li>
					<li>
						<a
							href="#contact"
							className={activeSection === "contact" ? "active-link" : ""}
						>
							.contact()
						</a>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default Navbar;

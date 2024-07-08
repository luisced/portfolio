import React, { useEffect, useState } from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./Contact.css";

const ContactForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState("");
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/contact", formData);
			setStatus("Message sent successfully!");
			setFormData({
				name: "",
				email: "",
				subject: "",
				message: "",
			});
		} catch (error) {
			setStatus("There was an error sending your message. Please try again.");
		}
	};

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 1024);
		};

		window.addEventListener("resize", handleResize);

		const mouseBlob = document.getElementById("mouse-blob");
		const handleMouseMove = (e) => {
			const offsetX = mouseBlob.offsetWidth / 2;
			const offsetY = mouseBlob.offsetHeight / 2;
			mouseBlob.style.left = `${e.clientX - offsetX}px`;
			mouseBlob.style.top = `${e.clientY - offsetY}px`;
		};

		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("resize", handleResize);
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<>
			<div className="contact-form-container">
				<div className="contact-form-column">
					<h2>Contact Me</h2>
					{status && <p className="status-message">{status}</p>}
					<form className="contact-form" onSubmit={handleSubmit}>
						<label htmlFor="name">
							Name:
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</label>
						<label htmlFor="email">
							Email:
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</label>
						<label htmlFor="subject">
							Subject:
							<input
								type="text"
								id="subject"
								name="subject"
								value={formData.subject}
								onChange={handleChange}
							/>
						</label>
						<label htmlFor="message">
							Message:
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleChange}
								required
							></textarea>
						</label>
						<button type="submit">Send</button>
					</form>
				</div>
				{!isMobile && (
					<div className="contact-form-column lottie-container">
						<DotLottieReact
							src="https://lottie.host/5c41e79d-7c62-427c-921b-cf1edb4ead19/4TtZhQb154.json"
							loop
							autoplay
							autoResizeCanvas
						/>
					</div>
				)}
			</div>
			<div className="noise-bg"></div>
			<div className="anim-blobs">
				<div className="blob-2"></div>
				<div className="blob-3"></div>
				<div className="blob-4"></div>
				<div className="blob-5" id="mouse-blob"></div>
				<div className="blob-6"></div>
				<div className="blob-7"></div>
			</div>
		</>
	);
};

export default ContactForm;

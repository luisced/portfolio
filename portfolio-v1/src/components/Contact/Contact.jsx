import React, { useEffect, useState } from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Turnstile } from "@marsidev/react-turnstile";
import "./Contact.css";
import Background from "../Background/Background";

const ContactForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [turnstileToken, setTurnstileToken] = useState("");
	const [status, setStatus] = useState("");
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 1024);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!formData.name ||
			!formData.email ||
			!formData.subject ||
			!formData.message
		) {
			setStatus("All fields are required.");
			return;
		}

		if (!turnstileToken) {
			setStatus("Please complete the Turnstile challenge.");
			return;
		}

		const sanitizedData = {
			name: formData.name.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
			email: formData.email.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
			subject: formData.subject.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
			message: formData.message.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
			"cf-turnstile-response": turnstileToken,
		};

		try {
			await axios.post(
				"https://mail.luishomeserver.com/api/contact",
				sanitizedData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			setStatus("Message sent successfully!");
			setFormData({
				name: "",
				email: "",
				subject: "",
				message: "",
			});
			setTurnstileToken("");
		} catch (error) {
			setStatus("There was an error sending your message. Please try again.");
		}
	};

	return (
		<>
			<Background />
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
								aria-label="Name"
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
								aria-label="Email"
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
								aria-label="Subject"
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
								aria-label="Message"
							></textarea>
						</label>
						<Turnstile
							siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
							onSuccess={(token) => setTurnstileToken(token)}
						/>
						<button type="submit" aria-label="Send">
							Send
						</button>
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
		</>
	);
};

export default ContactForm;

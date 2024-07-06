import React, { useState, useRef, useEffect } from "react";
import "./Popover.css";

const Popover = ({ title, content, children }) => {
	const [visible, setVisible] = useState(false);
	const popoverRef = useRef();

	const handleMouseEnter = () => {
		setVisible(true);
	};

	const handleMouseLeave = () => {
		setVisible(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popoverRef.current && !popoverRef.current.contains(event.target)) {
				setVisible(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [popoverRef]);

	return (
		<div
			className="popover-wrapper"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={popoverRef}
		>
			{children}
			{visible && (
				<div className="popover-content">
					<div className="popover-title">{title}</div>
					<div className="popover-body">{content}</div>
				</div>
			)}
		</div>
	);
};

export default Popover;

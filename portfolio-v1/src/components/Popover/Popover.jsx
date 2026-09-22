import React from "react";
import "./Popover.css";

const Popover = ({ title, content, children }) => {
	return (
		<div className="popover-wrapper">
			{children}
			<div className="popover-content">
				<div className="popover-arrow"></div>
				<div className="popover-title">{title}</div>
				<div className="popover-body">{content}</div>
			</div>
		</div>
	);
};

export default Popover;

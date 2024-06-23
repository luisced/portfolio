import "./BackgroundTransition.css";

const BackgroundTransition = ({ gradient }) => {
	return (
		<div
			className="background-transition"
			style={{ background: gradient }}
		></div>
	);
};

export default BackgroundTransition;

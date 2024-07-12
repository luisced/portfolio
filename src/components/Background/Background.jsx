import React, { useEffect } from "react";
import "./Background.css";

const debounce = (func, delay) => {
	let inDebounce;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(context, args), delay);
	};
};

const Background = () => {
	useEffect(() => {
		const mouseBlob = document.getElementById("mouse-blob");
		const handleMouseMove = (e) => {
			const offsetX = mouseBlob.offsetWidth / 2;
			const offsetY = mouseBlob.offsetHeight / 2;
			mouseBlob.style.left = `${e.clientX - offsetX}px`;
			mouseBlob.style.top = `${e.clientY - offsetY}px`;
		};

		const debouncedHandleMouseMove = debounce(handleMouseMove, 10);

		document.addEventListener("mousemove", debouncedHandleMouseMove);

		return () => {
			document.removeEventListener("mousemove", debouncedHandleMouseMove);
		};
	}, []);

	return (
		<div className="background-wrapper">
			<div className="blob-1"></div>
			<div className="blob-2"></div>
			<div className="blob-3"></div>
			<div className="blob-4"></div>
			<div className="blob-5" id="mouse-blob"></div>
			<div className="blob-6"></div>
			<div className="blob-7"></div>
			<div className="noise-bg"></div>
		</div>
	);
};

export default Background;
